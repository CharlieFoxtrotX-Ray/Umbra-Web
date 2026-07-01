// ───────────────────────────────────────────────────────────────
// UMBRA — Panel del creador (partner).
// Login con Google (auth.js) → GET /api/partners/me → muestra link,
// código, referidos y ganancias. Polling porque auth.js no emite evento
// en la misma pestaña. Sin datos reales hasta que el backend esté desplegado.
// ───────────────────────────────────────────────────────────────
(function () {
  'use strict';

  var API_BASE = ((document.querySelector('meta[name="umbra-api-base"]') || {}).content || '')
    .replace(/\/$/, '') || 'http://localhost:3000';
  var AUTH_KEY = 'umbra:auth';

  function token() { try { var a = JSON.parse(localStorage.getItem(AUTH_KEY)); return (a && a.token) || null; } catch (e) { return null; } }
  function el(id) { return document.getElementById(id); }
  function show(id) { ['gate', 'notpartner', 'loading', 'dash'].forEach(function (x) { el(x).hidden = (x !== id); }); }
  function money(c) { return '$' + ((Number(c) || 0) / 100).toFixed(2); }
  function day(s) { return s ? new Date(s).toLocaleDateString('es') : '—'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  var lastToken = null, loaded = false;

  function refresh() {
    var t = token();
    if (!t) { show('gate'); loaded = false; lastToken = null; return; }
    if (loaded && t === lastToken) return;
    lastToken = t; show('loading');
    fetch(API_BASE + '/api/partners/me', { headers: { 'Authorization': 'Bearer ' + t } })
      .then(function (r) { if (r.status === 401) throw new Error('401'); return r.json(); })
      .then(function (d) {
        loaded = true;
        if (!d || !d.partner) { show('notpartner'); return; }
        render(d); show('dash');
      })
      .catch(function (e) { loaded = false; if (String(e.message).indexOf('401') >= 0) show('gate'); else show('notpartner'); });
  }

  function tierTag(tier) {
    var m = { elite: ['tag-elite', 'Elite'], partner: ['tag-partner', 'Partner'], creator: ['tag-creator', 'Creator'] };
    var x = m[tier] || m.creator; var s = document.createElement('span'); s.className = 'tag ' + x[0]; s.textContent = x[1]; return s;
  }
  function commPill(s) {
    var m = { paid: ['grn', 'pagada'], clawed_back: ['red', 'anulada'], pending: ['acc', 'pendiente'] };
    var x = m[s] || m.pending; return '<span class="pill ' + x[0] + '">' + x[1] + '</span>';
  }

  function render(d) {
    var p = d.partner, s = d.stats || {};
    var link = location.origin + '/?ref=' + encodeURIComponent(p.code);
    el('reflink').value = link;
    el('code').textContent = p.code;
    el('pct').textContent = p.commission_pct + '%';
    var tt = el('tierTag'); tt.innerHTML = ''; tt.appendChild(tierTag(p.tier));

    el('st-ref').textContent = s.referrals != null ? s.referrals : 0;
    el('st-conv').textContent = (s.commissions || 0) + ' compras';
    el('st-sales').textContent = money(s.sales_cents);
    el('st-pending').textContent = money(s.pending_cents);
    el('st-paid').textContent = money(s.paid_cents);

    var tb = el('comm').querySelector('tbody'); tb.innerHTML = '';
    var coms = d.commissions || [];
    if (!coms.length) {
      tb.innerHTML = '<tr><td colspan="5" style="color:rgba(255,255,255,.4);text-align:center">Todavía no hay comisiones. ¡Compartí tu link!</td></tr>';
    } else coms.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + day(c.created_at) + '</td><td class="num">' + money(c.usd_cents) + '</td><td class="num">' + c.pct + '%</td><td class="num">' + money(c.commission_cents) + '</td><td>' + commPill(c.status) + '</td>';
      tb.appendChild(tr);
    });

    var pays = d.payouts || [];
    if (pays.length) {
      el('payTitle').hidden = false; el('payWrap').hidden = false;
      var pb = el('pays').querySelector('tbody'); pb.innerHTML = '';
      pays.forEach(function (x) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + day(x.created_at) + '</td><td>' + esc(x.period || '—') + '</td><td class="num">' + money(x.amount_cents) + '</td><td>' + esc(x.note || '') + '</td>';
        pb.appendChild(tr);
      });
    }
  }

  var cb = el('copybtn');
  if (cb) cb.addEventListener('click', function () {
    var inp = el('reflink');
    var done = function () { var t = el('toast'); t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inp.value).then(done).catch(function () { inp.select(); try { document.execCommand('copy'); done(); } catch (e) {} });
    } else { inp.select(); try { document.execCommand('copy'); done(); } catch (e) {} }
  });

  refresh();
  setInterval(refresh, 900);
})();
