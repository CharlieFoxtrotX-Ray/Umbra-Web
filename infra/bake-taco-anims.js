#!/usr/bin/env node
/*
  Cuece las animaciones de Taco para la web.

  Uso:
    node infra/bake-taco-anims.js <taco.glb> <carpeta-de-clips> <salida.bin>

  Entrada: el modelo de Taco (riggeado con el preajuste Mixamo) y los clips de
  mascota-escritorio (`public/pets/clips/*.glb`), que son esqueletos de Mixamo
  sin malla. Salida: un único binario con las rotaciones locales de cada hueso
  de TACO, fotograma a fotograma, listo para interpolar en js/taco-3d.js.

  Por qué hace falta cocer: un clip de Mixamo trae la rotación local de cada
  hueso dicha en el reposo de SU esqueleto, y el de Taco viene en otro (la
  cadera girada 90°, los muslos casi 180°). Lo que sí es común es el giro EN
  EL MUNDO que el clip le impone a cada hueso respecto a su reposo; ese giro
  se aplica al reposo de Taco y se vuelve a local dividiendo por el padre.
  Es el mismo criterio que usa pet-model-painter en la app de escritorio.

  Sin dependencias: el lector de glTF y las cuentas de cuaterniones van aquí.

  Formato de salida (little-endian):
    u32 'TACO' · u32 largo del JSON · JSON (relleno a múltiplo de 4)
    después, por clip: Int16[frames × huesos × 4] (cuaternión × 32767)
                       Float32[frames] (altura de la cadera)
*/
'use strict';
const fs = require('fs');
const path = require('path');

const FPS = 24;

// ── glTF ────────────────────────────────────────────────────────────────
function readGLB(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error(file + ': no es un GLB');
  let off = 12, json = null, bin = null;
  while (off < b.length) {
    const len = b.readUInt32LE(off), type = b.readUInt32LE(off + 4);
    const chunk = b.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8'));
    else if (type === 0x004e4942) bin = chunk;
    off += 8 + len;
  }
  return { json, bin };
}
function floats(g, index) {
  const a = g.json.accessors[index], bv = g.json.bufferViews[a.bufferView];
  if (a.componentType !== 5126) throw new Error('se esperaban float32');
  const n = { SCALAR: 1, VEC3: 3, VEC4: 4 }[a.type];
  const start = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new Float32Array(a.count * n);
  for (let i = 0; i < out.length; i++) out[i] = g.bin.readFloatLE(start + i * 4);
  return out;
}

// ── cuaterniones [x, y, z, w] ───────────────────────────────────────────
const qmul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const qinv = (q) => [-q[0], -q[1], -q[2], q[3]];
const qnorm = (q) => { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; };
const qaxis = (x, y, z, rad) => { const s = Math.sin(rad / 2); return [x * s, y * s, z * s, Math.cos(rad / 2)]; };
function qlerp(a, b, t) {
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = d < 0 ? -1 : 1;
  return qnorm([a[0] + (s * b[0] - a[0]) * t, a[1] + (s * b[1] - a[1]) * t, a[2] + (s * b[2] - a[2]) * t, a[3] + (s * b[3] - a[3]) * t]);
}

// ── esqueleto: padres, orden de padres a hijos, reposo ──────────────────
function skeleton(g) {
  const nodes = g.json.nodes;
  const parent = new Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => (n.children || []).forEach((c) => { parent[c] = i; }));
  const order = [];
  const visit = (i) => { order.push(i); (nodes[i].children || []).forEach(visit); };
  nodes.forEach((_, i) => { if (parent[i] === -1) visit(i); });
  const rest = nodes.map((n) => n.rotation ? n.rotation.slice() : [0, 0, 0, 1]);
  const byName = new Map(nodes.map((n, i) => [n.name, i]));
  return { nodes, parent, order, rest, byName };
}
function worldQuats(sk, local) {
  const w = new Array(sk.nodes.length);
  for (const i of sk.order) w[i] = sk.parent[i] === -1 ? local[i] : qmul(w[sk.parent[i]], local[i]);
  return w;
}

// ── clip de Mixamo: muestreo de sus pistas ──────────────────────────────
function loadClip(file) {
  const g = readGLB(file);
  const sk = skeleton(g);
  const anim = g.json.animations[0];
  const tracks = anim.channels.map((ch) => {
    const s = anim.samplers[ch.sampler];
    if ((s.interpolation || 'LINEAR') !== 'LINEAR') throw new Error(file + ': interpolación no lineal');
    return { node: ch.target.node, path: ch.target.path, times: floats(g, s.input), values: floats(g, s.output) };
  });
  const dur = Math.max(...tracks.map((t) => t.times[t.times.length - 1]));
  const hips = sk.nodes.findIndex((n) => /Hips$/.test(n.name || ''));
  const hipsRestY = (sk.nodes[hips].translation || [0, 0, 0])[1];
  const sample = (t) => {
    const local = sk.rest.map((q) => q.slice());
    let hipsY = hipsRestY;
    for (const tr of tracks) {
      const T = tr.times;
      let k = 0;
      while (k < T.length - 2 && T[k + 1] < t) k++;
      const span = T[k + 1] - T[k];
      const f = span > 0 ? Math.min(1, Math.max(0, (t - T[k]) / span)) : 0;
      if (tr.path === 'rotation') {
        local[tr.node] = qlerp(tr.values.subarray(k * 4, k * 4 + 4), tr.values.subarray(k * 4 + 4, k * 4 + 8), f);
      } else if (tr.path === 'translation' && tr.node === hips) {
        hipsY = tr.values[k * 3 + 1] + (tr.values[k * 3 + 4] - tr.values[k * 3 + 1]) * f;
      }
    }
    return { world: worldQuats(sk, local), hipsY };
  };
  return { sk, dur, sample, bindWorld: worldQuats(sk, sk.rest), hipsRestY };
}

// ── cocido sobre el esqueleto de Taco ───────────────────────────────────
function main() {
  const [modelFile, clipsDir, outFile] = process.argv.slice(2);
  if (!modelFile || !clipsDir || !outFile) {
    console.error('Uso: node infra/bake-taco-anims.js <taco.glb> <carpeta-de-clips> <salida.bin>');
    process.exit(1);
  }
  const model = readGLB(modelFile);
  const sk = skeleton(model);
  const joints = model.json.skins[0].joints;                 // índices de nodo, en el orden de la skin
  const isJoint = new Set(joints);
  const bones = sk.order.filter((i) => isJoint.has(i));      // de padres a hijos
  const bindWorld = worldQuats(sk, sk.rest);
  const hips = bones.find((i) => /Hips$/.test(sk.nodes[i].name));
  const hipsRest = sk.nodes[hips].translation || [0, 0, 0];

  const bakeFrame = (clip, t) => {
    const src = clip.sample(t);
    const world = new Array(sk.nodes.length);
    const local = new Array(sk.nodes.length);
    for (const b of bones) {
      const p = sk.parent[b];
      const parentWorld = isJoint.has(p) ? world[p] : (p === -1 ? [0, 0, 0, 1] : bindWorld[p]);
      const c = clip.sk.byName.get(sk.nodes[b].name);
      world[b] = c === undefined
        ? qmul(parentWorld, sk.rest[b])
        : qmul(qmul(src.world[c], qinv(clip.bindWorld[c])), bindWorld[b]);
      local[b] = qnorm(qmul(qinv(parentWorld), world[b]));
    }
    const k = clip.hipsRestY ? hipsRest[1] / clip.hipsRestY : 1;
    return { local, hipsY: hipsRest[1] + (src.hipsY - clip.hipsRestY) * k };
  };

  const bake = (name, file, loop) => {
    const clip = loadClip(path.join(clipsDir, file));
    const frames = Math.max(2, Math.round(clip.dur * FPS) + 1);
    const out = [];
    for (let i = 0; i < frames; i++) out.push(bakeFrame(clip, Math.min((i / (frames - 1)) * clip.dur, clip.dur - 1e-4)));
    return { name, dur: clip.dur, loop, frames: out };
  };

  const clips = [
    bake('walk', 'andar-v01.glb', true),
    bake('run', 'correr-v01.glb', true),
    bake('wave', 'saludar-v01.glb', false),
    bake('jump', 'saltar-v01.glb', false),
    bake('sit', 'sentarse-v01.glb', false),
    bake('cheer', 'reverencia-v01.glb', false),
  ];

  // «idle»: no hay clip de estar quieto. Se parte del primer fotograma del
  // saludo (de pie, brazos abajo) y se le suma una respiración: la columna se
  // inclina un poco y la cabeza mira despacio a los lados. 4 s, en bucle.
  const base = clips.find((c) => c.name === 'wave').frames[0];
  const find = (re) => bones.find((i) => re.test(sk.nodes[i].name));
  const spine = find(/Spine1$/), head = find(/Head$/), neck = find(/Neck$/);
  const idleFrames = [];
  const IDLE_DUR = 4, n = IDLE_DUR * FPS + 1;
  for (let i = 0; i < n; i++) {
    const ph = (i / (n - 1)) * Math.PI * 2;
    const local = base.local.map((q) => q && q.slice());
    // Los ejes locales de Taco no coinciden con los del mundo, así que la
    // respiración se suma como giro EN EL MUNDO sobre el hueso y se vuelve a local.
    const add = (bone, wq) => {
      const lw = worldOf(local, bone);
      const pw = parentWorldOf(local, bone);
      local[bone] = qnorm(qmul(qinv(pw), qmul(wq, lw)));
    };
    add(spine, qaxis(1, 0, 0, Math.sin(ph) * 0.022));
    add(neck, qaxis(0, 1, 0, Math.sin(ph * 0.5) * 0.10));
    add(head, qaxis(0, 0, 1, Math.sin(ph * 0.5 + 0.7) * 0.03));
    idleFrames.push({ local, hipsY: base.hipsY + Math.sin(ph) * 0.004 });
  }
  function parentWorldOf(local, bone) {
    const chain = [];
    for (let p = sk.parent[bone]; p !== -1; p = sk.parent[p]) chain.push(p);
    let w = [0, 0, 0, 1];
    for (const p of chain.reverse()) w = qmul(w, isJoint.has(p) ? local[p] : sk.rest[p]);
    return w;
  }
  function worldOf(local, bone) { return qmul(parentWorldOf(local, bone), local[bone]); }
  clips.unshift({ name: 'idle', dur: IDLE_DUR, loop: true, frames: idleFrames });

  // ── escritura ──
  const meta = { version: 1, fps: FPS, bones, hips, clips: [] };
  const blobs = [];
  let offset = 0;
  for (const c of clips) {
    const rot = new Int16Array(c.frames.length * bones.length * 4);
    const hip = new Float32Array(c.frames.length);
    c.frames.forEach((f, i) => {
      bones.forEach((b, j) => {
        const q = f.local[b];
        for (let k = 0; k < 4; k++) rot[(i * bones.length + j) * 4 + k] = Math.round(q[k] * 32767);
      });
      hip[i] = f.hipsY;
    });
    const rotBytes = Buffer.from(rot.buffer), hipBytes = Buffer.from(hip.buffer);
    const pad = (4 - (rotBytes.length % 4)) % 4;
    meta.clips.push({ name: c.name, dur: +c.dur.toFixed(4), loop: c.loop, frames: c.frames.length, rot: offset, hip: offset + rotBytes.length + pad });
    blobs.push(rotBytes, Buffer.alloc(pad), hipBytes);
    offset += rotBytes.length + pad + hipBytes.length;
  }
  let json = Buffer.from(JSON.stringify(meta), 'utf8');
  json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const header = Buffer.alloc(8);
  header.writeUInt32LE(0x4f434154, 0);   // 'TACO'
  header.writeUInt32LE(json.length, 4);
  fs.writeFileSync(outFile, Buffer.concat([header, json, ...blobs]));
  console.log(`${path.basename(outFile)}: ${bones.length} huesos, ${clips.map((c) => `${c.name} ${c.frames.length}f`).join(' · ')} → ${(8 + json.length + offset)} bytes`);
}
main();
