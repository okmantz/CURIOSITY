/* Library index, search, recall-card generation and generative art */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.byId = {};
  C.library.forEach((e) => { C.byId[e.id] = e; });
  C.topic = (id) => C.TOPICS.find((t) => t.id === id) || C.TOPICS[0];

  C.thinkerIndex = (function () {
    const m = {};
    C.library.forEach((e) => (e.thinkers || []).forEach((t) => { (m[t] = m[t] || []).push(e.id); }));
    return m;
  })();

  C.search = function (q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/);
    return C.library.map((e) => {
      const hay = (e.title + ' ' + e.hook + ' ' + C.topic(e.topic).name + ' ' + (e.thinkers || []).join(' ') + ' ' + C.FORMATS[e.type].name + ' ' + (e.takeaway || '')).toLowerCase();
      let s = 0;
      for (const w of words) { if (hay.includes(w)) s += e.title.toLowerCase().includes(w) ? 3 : 1; else return null; }
      return { e, s };
    }).filter(Boolean).sort((a, b) => b.s - a.s).map((x) => x.e);
  };

  /** Dynamic memory-check card for an experience the user completed earlier. */
  C.makeRecall = function (id) {
    const e = C.byId[id];
    const day = C.dateKey();
    const r = C.rng('recall:' + id + ':' + day);
    const others = C.shuffle(C.library.filter((x) => x.id !== id && x.topic !== e.topic && x.takeaway), r).slice(0, 2);
    const opts = C.shuffle([{ t: e.takeaway, ok: true }, ...others.map((o) => ({ t: o.takeaway, ok: false }))], r);
    return { id: 'recall:' + id, type: 'recall', of: id, topic: e.topic, diff: e.diff, mins: 1, title: 'Memory check: ' + e.title, hook: 'You explored this a while ago. Which idea belonged to it?', links: [], thinkers: [], options: opts, takeaway: e.takeaway, prompt: e.prompt };
  };
  C.resolve = function (id) {
    if (id && id.startsWith('recall:')) return C.makeRecall(id.slice(7));
    if (id && id.startsWith('drill:') && C.atlas) {
      const parts = id.split(':'), t = C.atlas.table(parts[1]);
      if (!t) return null;
      const d = C.makeDrill(t.topic, parts.slice(2).join(':'));
      if (d) { d.tid = t.id; d.id = id; d.title = 'Quickfire: ' + t.title; }
      return d;
    }
    return C.byId[id];
  };

  /* ---------- Generative art (original, topic-specific motifs) ---------- */
  function f(n) { return Math.round(n * 10) / 10; }
  const M = {
    arches(r, c) {
      let s = '';
      for (let row = 0; row < 6; row++) {
        const y = 140 + row * 95, w = 60 + row * 14, n = Math.ceil(420 / w) + 1;
        for (let i = -1; i < n; i++) {
          const x = i * w + (row % 2 ? w / 2 : 0) - 10;
          s += `<path d="M${f(x)} ${y + 90} V${y + 30} a${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(w)} 0 V${y + 90}" fill="none" stroke="${c}" stroke-opacity="${f(0.1 + r() * 0.12)}" stroke-width="1.4"/>`;
        }
      }
      return s;
    },
    rings(r, c) {
      let s = ''; const cx = 120 + r() * 160, cy = 220 + r() * 100;
      for (let i = 1; i < 16; i++) s += `<circle cx="${f(cx + i * 6)}" cy="${f(cy + i * 3)}" r="${i * 22}" fill="none" stroke="${c}" stroke-opacity="${f(0.06 + (i % 3) * 0.05)}" stroke-width="1.2"/>`;
      return s + `<circle cx="${f(cx)}" cy="${f(cy)}" r="34" fill="${c}" fill-opacity="0.10"/>`;
    },
    mandala(r, c) {
      let s = ''; const n = 12 + Math.floor(r() * 3) * 4;
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i;
        s += `<g transform="rotate(${f(a)} 200 260)"><ellipse cx="200" cy="130" rx="${14 + r() * 8}" ry="${70 + r() * 20}" fill="none" stroke="${c}" stroke-opacity="0.16" stroke-width="1.2"/><circle cx="200" cy="${f(50 + r() * 20)}" r="3" fill="${c}" fill-opacity="0.3"/></g>`;
      }
      return s + `<circle cx="200" cy="260" r="38" fill="none" stroke="${c}" stroke-opacity="0.25"/><circle cx="200" cy="260" r="6" fill="${c}" fill-opacity="0.5"/>`;
    },
    ink(r, c) {
      let s = '';
      for (let i = 0; i < 16; i++) {
        const y = 90 + i * 34 + r() * 8, amp = 6 + r() * 16, x0 = -20, len = 440;
        s += `<path d="M${x0} ${f(y)} q${f(len / 4)} ${f(-amp)} ${f(len / 2)} 0 t${f(len / 2)} 0" fill="none" stroke="${c}" stroke-opacity="${f(0.05 + r() * 0.14)}" stroke-width="${f(1 + r() * 2)}" stroke-linecap="round"/>`;
      }
      return s;
    },
    ripples(r, c) {
      let s = '';
      for (let k = 0; k < 3; k++) {
        const cx = 60 + r() * 280, cy = 140 + r() * 300;
        for (let i = 1; i < 9; i++) s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${i * 20}" fill="none" stroke="${c}" stroke-opacity="${f(0.2 / (i * 0.6 + 1))}" stroke-width="1.2"/>`;
      }
      return s;
    },
    orbits(r, c) {
      let s = '';
      for (let i = 0; i < 70; i++) s += `<circle cx="${f(r() * 400)}" cy="${f(r() * 700)}" r="${f(0.5 + r() * 1.5)}" fill="#fff" fill-opacity="${f(0.15 + r() * 0.5)}"/>`;
      for (let i = 0; i < 5; i++) s += `<ellipse cx="200" cy="260" rx="${70 + i * 42}" ry="${28 + i * 16}" transform="rotate(${f(-30 + i * 12)} 200 260)" fill="none" stroke="${c}" stroke-opacity="${f(0.1 + (i % 2) * 0.1)}" stroke-width="1.2"/>`;
      return s + `<circle cx="200" cy="260" r="16" fill="${c}" fill-opacity="0.25"/>`;
    },
    steps(r, c) {
      let s = '', h0 = 120;
      for (let i = 0; i < 10; i++) { const h = h0 + i * 36 + r() * 24; s += `<rect x="${i * 42}" y="${f(620 - h)}" width="38" height="${f(h)}" fill="${c}" fill-opacity="${f(0.05 + i * 0.012)}"/>`; }
      let d = 'M0 560'; for (let i = 1; i <= 10; i++) d += ` L${i * 42} ${f(560 - i * 32 - r() * 30)}`;
      return s + `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="0.45" stroke-width="2"/>`;
    },
    strokes(r, c) {
      let s = '';
      for (let i = 0; i < 9; i++) {
        const x = r() * 400, y = 80 + r() * 520;
        s += `<path d="M${f(x)} ${f(y)} c${f(40 + r() * 90)} ${f(-60 + r() * 120)} ${f(100 + r() * 120)} ${f(-60 + r() * 120)} ${f(180 + r() * 120)} ${f(-30 + r() * 60)}" fill="none" stroke="${c}" stroke-opacity="${f(0.07 + r() * 0.13)}" stroke-width="${f(8 + r() * 28)}" stroke-linecap="round"/>`;
      }
      return s;
    },
    balance(r, c) {
      const tilt = (r() - 0.5) * 14;
      return `<g transform="rotate(${f(tilt)} 200 220)"><path d="M70 220 H330" stroke="${c}" stroke-opacity="0.4" stroke-width="2"/><path d="M70 220 L40 330 H100 Z M330 220 L300 330 H360 Z" fill="none" stroke="${c}" stroke-opacity="0.3"/></g><path d="M200 220 V420 M150 420 H250" stroke="${c}" stroke-opacity="0.4" stroke-width="2"/><circle cx="200" cy="214" r="7" fill="${c}" fill-opacity="0.5"/>` + [1, 2, 3, 4].map((i) => `<path d="M0 ${430 + i * 30} H400" stroke="${c}" stroke-opacity="0.06"/>`).join('');
    },
    contours(r, c) {
      let s = ''; const cx = 140 + r() * 120, cy = 240 + r() * 100, ph = [r() * 6, r() * 6, r() * 6];
      for (let k = 1; k < 13; k++) {
        let d = '';
        for (let a = 0; a <= 360; a += 10) {
          const t = (a * Math.PI) / 180, rad = k * 22 * (1 + 0.18 * Math.sin(3 * t + ph[0]) + 0.1 * Math.sin(5 * t + ph[1]) + 0.07 * Math.sin(2 * t + ph[2]));
          d += (a ? 'L' : 'M') + f(cx + rad * Math.cos(t)) + ' ' + f(cy + rad * 0.8 * Math.sin(t));
        }
        s += `<path d="${d}Z" fill="none" stroke="${c}" stroke-opacity="${f(0.07 + (k % 4 === 0 ? 0.12 : 0))}" stroke-width="1.2"/>`;
      }
      return s;
    },
    constellation(r, c) {
      const pts = Array.from({ length: 16 }, () => [30 + r() * 340, 100 + r() * 480]); let s = '';
      pts.forEach((p, i) => { const q = pts[(i * 5 + 3) % pts.length]; s += `<path d="M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])}" stroke="${c}" stroke-opacity="0.18"/>`; });
      pts.forEach((p) => { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(2 + r() * 3)}" fill="${c}" fill-opacity="0.5"/>`; });
      return s;
    },
    horizon(r, c) {
      let s = `<circle cx="${f(120 + r() * 160)}" cy="330" r="${f(70 + r() * 30)}" fill="${c}" fill-opacity="0.16"/>`;
      for (let i = 0; i < 9; i++) s += `<path d="M0 ${340 + i * 24} H400" stroke="${c}" stroke-opacity="${f(0.05 + i * 0.015)}" stroke-width="${f(1 + i * 0.4)}"/>`;
      return s;
    }
  };
  C.art = function (exp) {
    const t = C.topic(exp.topic), r = C.rng(exp.id);
    const motif = (M[t.motif] || M.rings)(r, t.color);
    const glow = `<radialGradient id="g${C.hashStr(exp.id)}" cx="${f(20 + r() * 60)}%" cy="${f(10 + r() * 40)}%" r="80%"><stop offset="0" stop-color="${t.color}" stop-opacity="0.34"/><stop offset="1" stop-color="${t.color}" stop-opacity="0"/></radialGradient>`;
    return `<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>${glow}</defs><rect width="400" height="700" fill="url(#g${C.hashStr(exp.id)})"/>${motif}</svg>`;
  };
})();
