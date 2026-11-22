/* Utilities: DOM helper, icons, seeded random, dates */
(function () {
  const C = (window.CUR = window.CUR || {});

  function append(el, kids) {
    for (const k of kids.flat(Infinity)) {
      if (k == null || k === false) continue;
      el.append(k.nodeType ? k : document.createTextNode(String(k)));
    }
  }
  /** Tiny hyperscript. Text is always inserted as text (never HTML) except via the `html` attr for trusted static markup. */
  C.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    append(el, kids);
    return el;
  };
  C.$ = (s, r = document) => r.querySelector(s);
  C.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  C.clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  const P = {
    spark: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>',
    bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
    share: '<path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 000-6h-4a3 3 0 010-6h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
    brain: '<circle cx="7" cy="8" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><circle cx="18" cy="15" r="1.5"/><path d="M8.8 9l2.2 6M15.3 8.2l-2.4 7M9 8h6M17 9v4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2-1-3 0-5 1-8z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
    scale: '<path d="M12 4v16M6 20h12M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    volume: '<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 010 7"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
    book: '<path d="M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/>',
    refresh: '<path d="M20 11a8 8 0 10-2 6M20 4v7h-7"/>'
  };
  C.icon = function (name, size = 22, cls = '') {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.7');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = P[name] || P.spark;
    return s;
  };

  /* Logo: the open loop and the spark */
  C.logo = function (size = 28) {
    const wrap = document.createElement('span');
    wrap.className = 'logo-mark';
    wrap.innerHTML = '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="118 20" transform="rotate(-35 32 32)"/><circle cx="32" cy="32" r="5.5" fill="var(--gold)"/></svg>';
    return wrap;
  };

  /* Seeded RNG */
  C.hashStr = function (str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return (h >>> 0);
  };
  C.rng = function (seed) {
    let a = typeof seed === 'string' ? C.hashStr(seed) : seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  C.shuffle = function (arr, rand = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* Dates (local time) */
  C.dateKey = function (d = new Date()) {
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  C.parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  C.daysBetween = (a, b) => Math.round((C.parseKey(b) - C.parseKey(a)) / 86400000);
  C.addDays = (k, n) => { const d = C.parseKey(k); d.setDate(d.getDate() + n); return C.dateKey(d); };
  C.weekStart = (d = new Date()) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const dow = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dow); return C.dateKey(x); };
  C.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  C.fmtTime = (m) => m + ' min';
  C.pick = (arr, rand = Math.random) => arr[Math.floor(rand() * arr.length)];

  /* Toasts and sheets */
  C.toast = function (msg, ms = 2400, action) {
    let host = document.getElementById('toasts');
    if (!host) { host = C.h('div', { id: 'toasts', 'aria-live': 'polite' }); document.body.append(host); }
    const t = C.h('div', { class: 'toast' }, C.h('span', { text: msg }), action ? C.h('button', { class: 'toast-act', onclick: () => { action.fn(); t.remove(); } }, action.label) : null);
    if (action) ms = Math.max(ms, 4200);
    host.append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
  };
  C.sheet = function (title, content, opts = {}) {
    const back = C.h('div', { class: 'sheet-back', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    const close = () => { back.classList.add('out'); setTimeout(() => back.remove(), 220); document.removeEventListener('keydown', esc); opts.onClose && opts.onClose(); };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    const panel = C.h('div', { class: 'sheet' },
      C.h('div', { class: 'sheet-head' }, C.h('h3', { text: title }), C.h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: close }, C.icon('x', 20))),
      C.h('div', { class: 'sheet-body' }, content));
    back.append(panel);
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    document.addEventListener('keydown', esc);
    document.body.append(back);
    requestAnimationFrame(() => back.classList.add('in'));
    const f = panel.querySelector('textarea,input,button.primary');
    if (f && opts.focus !== false) setTimeout(() => f.focus({ preventScroll: true }), 80);
    return { close, el: back };
  };
  C.reducedMotion = () => document.documentElement.dataset.motion === 'reduce' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
})();
