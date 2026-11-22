/*
  UMBRA — Taco en 3D para la web.

  Motor propio y pequeño sobre WebGL2, sin librerías: lee el GLB de Taco (una
  malla con esqueleto y tres texturas), le aplica las animaciones ya cocidas
  por infra/bake-taco-anims.js (assets/3d/taco-anims.bin) y lo pinta en un
  canvas transparente. Solo sabe hacer eso: no es un visor glTF general.

  Uso:
    Taco3D.create(canvas, { model, anims }).then(function (taco) {
      taco.play('wave');        // idle | walk | run | wave | jump | sit | cheer
      taco.setYaw(Math.PI / 2); // hacia dónde mira; 0 = de frente
    });
  `create` rechaza la promesa si no hay WebGL2 con aceleración: quien llama
  decide qué enseñar en su lugar.
*/
(function () {
  'use strict';

  // ── matrices 4×4 en columnas (Float32Array de 16) ──
  function mul(out, a, b) {
    for (var c = 0; c < 4; c++) {
      var b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
      out[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
      out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
      out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
      out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
    }
    return out;
  }
  function fromTRS(out, t, q, qo, s) {
    var x = q[qo], y = q[qo + 1], z = q[qo + 2], w = q[qo + 3];
    var x2 = x + x, y2 = y + y, z2 = z + z;
    var xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
    var wx = w * x2, wy = w * y2, wz = w * z2;
    out[0] = (1 - (yy + zz)) * s[0]; out[1] = (xy + wz) * s[0]; out[2] = (xz - wy) * s[0]; out[3] = 0;
    out[4] = (xy - wz) * s[1]; out[5] = (1 - (xx + zz)) * s[1]; out[6] = (yz + wx) * s[1]; out[7] = 0;
    out[8] = (xz + wy) * s[2]; out[9] = (yz - wx) * s[2]; out[10] = (1 - (xx + yy)) * s[2]; out[11] = 0;
    out[12] = t[0]; out[13] = t[1]; out[14] = t[2]; out[15] = 1;
    return out;
  }
  function perspective(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2);
    out.fill(0);
    out[0] = f / aspect; out[5] = f; out[10] = (far + near) / (near - far); out[11] = -1;
    out[14] = (2 * far * near) / (near - far);
    return out;
  }
  function lookAt(out, eye, target) {
    var zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2];
    var l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    var xx = zz, xy = 0, xz = -zx;                       // up(0,1,0) × z
    l = Math.hypot(xx, xy, xz); xx /= l; xz /= l;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
    out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
    out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
    out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
    out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
    out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
    out[15] = 1;
    return out;
  }

  // ── GLB ──
  function parseGLB(buffer) {
    var dv = new DataView(buffer);
    if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('no es un GLB');
    var off = 12, json = null, bin = null;
    while (off < buffer.byteLength) {
      var len = dv.getUint32(off, true), type = dv.getUint32(off + 4, true);
      if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, off + 8, len)));
      else if (type === 0x004e4942) bin = { buffer: buffer, start: off + 8, length: len };
      off += 8 + len;
    }
    return { json: json, bin: bin };
  }
  var TYPES = { 5121: Uint8Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
  var SIZES = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
  // Copia el accesor a un array propio: quita de en medio la alineación y el entrelazado.
  function accessor(g, index) {
    var a = g.json.accessors[index], bv = g.json.bufferViews[a.bufferView];
    var T = TYPES[a.componentType], n = SIZES[a.type];
    if (!T || !n || a.sparse) throw new Error('accesor no soportado');
    var start = g.bin.start + (bv.byteOffset || 0) + (a.byteOffset || 0);
    var bytes = n * T.BYTES_PER_ELEMENT, stride = bv.byteStride || bytes;
    var out = new T(a.count * n);
    if (stride === bytes) {
      new Uint8Array(out.buffer).set(new Uint8Array(g.bin.buffer, start, a.count * bytes));
    } else {
      var src = new Uint8Array(g.bin.buffer), dst = new Uint8Array(out.buffer);
      for (var i = 0; i < a.count; i++) dst.set(src.subarray(start + i * stride, start + i * stride + bytes), i * bytes);
    }
    return { data: out, size: n, count: a.count, type: a.componentType };
  }

  var VERT = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aNor; in vec2 aUV; in vec4 aJoint; in vec4 aWeight;',
    'uniform sampler2D uJoints; uniform mat4 uVP; uniform mat4 uModel;',
    'out vec3 vNor; out vec2 vUV; out vec3 vPos;',
    'mat4 joint(float j){ int i = int(j + .5);',
    '  return mat4(texelFetch(uJoints, ivec2(0,i), 0), texelFetch(uJoints, ivec2(1,i), 0),',
    '              texelFetch(uJoints, ivec2(2,i), 0), texelFetch(uJoints, ivec2(3,i), 0)); }',
    'void main(){',
    '  mat4 skin = aWeight.x*joint(aJoint.x) + aWeight.y*joint(aJoint.y) + aWeight.z*joint(aJoint.z) + aWeight.w*joint(aJoint.w);',
    '  vec4 world = uModel * skin * vec4(aPos, 1.);',
    '  vNor = mat3(uModel) * mat3(skin) * aNor; vUV = aUV; vPos = world.xyz;',
    '  gl_Position = uVP * world; }'
  ].join('\n');
  // Luz sencilla en espacio gamma: cielo/suelo + un foco arriba a la izquierda
  // + un contraluz verde, el de los ojos de Taco, que lo separa del fondo oscuro.
  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vNor; in vec2 vUV; in vec3 vPos;',
    'uniform sampler2D uBase; uniform vec3 uEye;',
    'out vec4 color;',
    'void main(){',
    '  vec3 n = normalize(vNor); if (!gl_FrontFacing) n = -n;',
    '  vec3 base = texture(uBase, vUV).rgb;',
    '  float key = max(dot(n, normalize(vec3(-.45, .85, .65))), 0.);',
    '  float sky = .5 + .5 * n.y;',
    '  vec3 lit = base * (.62 + .32 * sky + .72 * key);',
    '  float rim = pow(1. - max(dot(n, normalize(uEye - vPos)), 0.), 2.6);',
    '  lit += vec3(.42, .86, .50) * rim * .30;',
    '  color = vec4(lit, 1.); }'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  }

  function parseAnims(buffer) {
    var dv = new DataView(buffer);
    if (dv.getUint32(0, true) !== 0x4f434154) throw new Error('animaciones: formato desconocido');
    var jsonLen = dv.getUint32(4, true);
    var meta = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 8, jsonLen)));
    var base = 8 + jsonLen, nb = meta.bones.length, clips = {};
    meta.clips.forEach(function (c) {
      clips[c.name] = {
        name: c.name, dur: c.dur, loop: c.loop, frames: c.frames,
        rot: new Int16Array(buffer.slice(base + c.rot, base + c.rot + c.frames * nb * 8)),
        hip: new Float32Array(buffer.slice(base + c.hip, base + c.hip + c.frames * 4))
      };
    });
    return { bones: meta.bones, hips: meta.hips, clips: clips };
  }

  function create(canvas, opts) {
    var gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: true, failIfMajorPerformanceCaveat: true });
    if (!gl) return Promise.reject(new Error('sin WebGL2 acelerado'));

    return Promise.all([
      fetch(opts.model).then(function (r) { if (!r.ok) throw new Error('modelo ' + r.status); return r.arrayBuffer(); }),
      fetch(opts.anims).then(function (r) { if (!r.ok) throw new Error('animaciones ' + r.status); return r.arrayBuffer(); })
    ]).then(function (res) {
      var g = parseGLB(res[0]), anims = parseAnims(res[1]), J = g.json;
      var mat = J.materials[J.meshes[0].primitives[0].material] || {};
      var texIndex = mat.pbrMetallicRoughness && mat.pbrMetallicRoughness.baseColorTexture ? mat.pbrMetallicRoughness.baseColorTexture.index : 0;
      var img = J.images[J.textures[texIndex].source], bv = J.bufferViews[img.bufferView];
      var blob = new Blob([new Uint8Array(g.bin.buffer, g.bin.start + (bv.byteOffset || 0), bv.byteLength)], { type: img.mimeType });
      return createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }).then(function (bitmap) {
        return build(canvas, gl, g, anims, bitmap);
      });
    });
  }

  function build(canvas, gl, g, anims, bitmap) {
    var J = g.json, prim = J.meshes[0].primitives[0], skin = J.skins[0];
    var nodeCount = J.nodes.length;

    // Esqueleto: TRS local de cada nodo, padres y orden de padres a hijos.
    var T = [], S = [], rot = new Float32Array(nodeCount * 4), parent = new Int16Array(nodeCount).fill(-1), order = [];
    J.nodes.forEach(function (n, i) {
      T.push(new Float32Array(n.translation || [0, 0, 0]));
      S.push(new Float32Array(n.scale || [1, 1, 1]));
      rot.set(n.rotation || [0, 0, 0, 1], i * 4);
      (n.children || []).forEach(function (c) { parent[c] = i; });
    });
    (function walk(list) { list.forEach(function (i) { order.push(i); walk(J.nodes[i].children || []); }); })(
      J.nodes.map(function (_, i) { return i; }).filter(function (i) { return parent[i] === -1; }));
    var world = new Float32Array(nodeCount * 16), local = new Float32Array(16);
    var ibm = accessor(g, skin.inverseBindMatrices).data, joints = skin.joints;
    var jointData = new Float32Array(joints.length * 16);

    // GL: programa, malla, texturas.
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'programa');
    gl.useProgram(prog);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    function attrib(name, key) {
      var a = accessor(g, prim.attributes[key]), loc = gl.getAttribLocation(prog, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, a.data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, a.size, a.type, false, 0, 0);
    }
    attrib('aPos', 'POSITION'); attrib('aNor', 'NORMAL'); attrib('aUV', 'TEXCOORD_0');
    attrib('aJoint', 'JOINTS_0'); attrib('aWeight', 'WEIGHTS_0');
    var index = accessor(g, prim.indices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index.data, gl.STATIC_DRAW);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.uniform1i(gl.getUniformLocation(prog, 'uBase'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 4, joints.length, 0, gl.RGBA, gl.FLOAT, jointData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(prog, 'uJoints'), 1);

    var uVP = gl.getUniformLocation(prog, 'uVP'), uModel = gl.getUniformLocation(prog, 'uModel'), uEye = gl.getUniformLocation(prog, 'uEye');
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    // Cámara: encuadra a Taco (mide ~0,89) con aire arriba para el salto.
    var eye = [0, 0.66, 3.05], target = [0, 0.56, 0];
    var proj = new Float32Array(16), view = new Float32Array(16), vp = new Float32Array(16), model = new Float32Array(16);
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      perspective(proj, 26 * Math.PI / 180, w / h, 0.1, 20);
      mul(vp, proj, lookAt(view, eye, target));
    }

    // Animación: clip actual + fundido desde la postura que había al cambiar.
    var bones = anims.bones, nb = bones.length, hipsNode = anims.hips;
    var clip = anims.clips.idle, clipStart = 0, fadeFrom = new Float32Array(nb * 4), fadeHip = 0, fadeStart = -1e9, fadeDur = 0.25;
    var pose = new Float32Array(nb * 4), poseHip = T[hipsNode][1], onEnd = null, rate = 1;
    var yaw = 0, yawTarget = 0, lastT = 0, running = false, raf = 0, disposed = false;

    function sample(c, t, out) {
      var f = Math.max(0, Math.min(c.frames - 1, t * (c.frames - 1) / c.dur));
      var i0 = Math.floor(f), i1 = Math.min(i0 + 1, c.frames - 1), k = f - i0;
      var a = i0 * nb * 4, b = i1 * nb * 4, r = c.rot;
      for (var j = 0; j < nb * 4; j += 4) {
        var ax = r[a + j], ay = r[a + j + 1], az = r[a + j + 2], aw = r[a + j + 3];
        var bx = r[b + j], by = r[b + j + 1], bz = r[b + j + 2], bw = r[b + j + 3];
        var s = ax * bx + ay * by + az * bz + aw * bw < 0 ? -k : k, u = 1 - k;
        var x = ax * u + bx * s, y = ay * u + by * s, z = az * u + bz * s, w = aw * u + bw * s;
        var l = 1 / (Math.hypot(x, y, z, w) || 1);
        out[j] = x * l; out[j + 1] = y * l; out[j + 2] = z * l; out[j + 3] = w * l;
      }
      return c.hip[i0] + (c.hip[i1] - c.hip[i0]) * k;
    }

    function frame(now) {
      raf = 0;
      if (!running || disposed) return;
      var t = now / 1000, dt = lastT ? Math.min(0.1, t - lastT) : 0;
      lastT = t;

      var ct = (t - clipStart) * rate;
      if (clip.loop) ct %= clip.dur;
      else if (ct >= clip.dur) {
        ct = clip.dur;
        if (onEnd) { var cb = onEnd; onEnd = null; cb(); }
      }
      poseHip = sample(clip, ct, pose);
      var w = fadeDur > 0 ? Math.min(1, (t - fadeStart) / fadeDur) : 1;
      if (w < 1) {
        w = w * w * (3 - 2 * w);
        for (var j = 0; j < nb * 4; j += 4) {
          var d = fadeFrom[j] * pose[j] + fadeFrom[j + 1] * pose[j + 1] + fadeFrom[j + 2] * pose[j + 2] + fadeFrom[j + 3] * pose[j + 3];
          var sg = d < 0 ? -1 : 1, u = 1 - w;
          var x = fadeFrom[j] * u * sg + pose[j] * w, y = fadeFrom[j + 1] * u * sg + pose[j + 1] * w;
          var z = fadeFrom[j + 2] * u * sg + pose[j + 2] * w, q = fadeFrom[j + 3] * u * sg + pose[j + 3] * w;
          var l = 1 / (Math.hypot(x, y, z, q) || 1);
          pose[j] = x * l; pose[j + 1] = y * l; pose[j + 2] = z * l; pose[j + 3] = q * l;
        }
        poseHip = fadeHip + (poseHip - fadeHip) * w;
      }
      for (var b = 0; b < nb; b++) rot.set(pose.subarray(b * 4, b * 4 + 4), bones[b] * 4);
      T[hipsNode][1] = poseHip;

      for (var o = 0; o < order.length; o++) {
        var n = order[o];
        fromTRS(local, T[n], rot, n * 4, S[n]);
        if (parent[n] === -1) world.set(local, n * 16);
        else mul(world.subarray(n * 16, n * 16 + 16), world.subarray(parent[n] * 16, parent[n] * 16 + 16), local);
      }
      for (var i = 0; i < joints.length; i++) {
        mul(jointData.subarray(i * 16, i * 16 + 16), world.subarray(joints[i] * 16, joints[i] * 16 + 16), ibm.subarray(i * 16, i * 16 + 16));
      }

      // Gira hacia donde va con un poco de retardo: un cambio en seco parece un fallo.
      yaw += (yawTarget - yaw) * Math.min(1, dt * 9);
      var c = Math.cos(yaw), s = Math.sin(yaw);
      model.fill(0); model[0] = c; model[2] = -s; model[5] = 1; model[8] = s; model[10] = c; model[15] = 1;

      resize();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE1);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 4, joints.length, gl.RGBA, gl.FLOAT, jointData);
      gl.uniformMatrix4fv(uVP, false, vp);
      gl.uniformMatrix4fv(uModel, false, model);
      gl.uniform3fv(uEye, eye);
      gl.drawElements(gl.TRIANGLES, index.count, index.type, 0);

      raf = requestAnimationFrame(frame);
    }

    var api = {
      clips: Object.keys(anims.clips),
      /** Cambia de animación fundiendo desde la postura actual. `then` se llama al acabar un clip que no va en bucle. */
      play: function (name, o) {
        var next = anims.clips[name];
        if (!next) return api;
        o = o || {};
        if (next === clip && clip.loop && !o.restart) { rate = o.rate || 1; return api; }
        fadeFrom.set(pose); fadeHip = poseHip;
        fadeStart = performance.now() / 1000; fadeDur = o.fade === undefined ? 0.28 : o.fade;
        clip = next; clipStart = fadeStart; rate = o.rate || 1; onEnd = o.then || null;
        return api;
      },
      current: function () { return clip.name; },
      setYaw: function (rad, instant) { yawTarget = rad; if (instant) yaw = rad; return api; },
      start: function () { if (!running && !disposed) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); } return api; },
      stop: function () { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } return api; },
      dispose: function () {
        api.stop(); disposed = true;
        var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
      }
    };
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); api.stop(); });
    sample(clip, 0, pose);
    return api;
  }

  window.Taco3D = { create: create };
})();
