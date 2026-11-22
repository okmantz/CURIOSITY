/* Format renderers, part 2: explore (timeline, scale, mercator, intervals, wason), literature, connections */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, T = C.tpl, kit = T.kit;
  const REGION_COL = { india: '#e0a458', china: '#d4605b', greece: '#7aa7e8', levant: '#9fd081' };

  const range = (min, max, step, val, label, onInput) => {
    const inp = h('input', { type: 'range', class: 'slider', min, max, step, value: val, 'aria-label': label });
    inp.addEventListener('input', () => onInput(parseFloat(inp.value)));
    return inp;
  };

  /* ---------- Explore dispatcher ---------- */
  T.explore = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    root.append(h('p', { class: 'lead', text: e.intro }));
    const K = T.exploreKinds[e.kind];
    root.append(K(e, ctx, (extra) => {
      const rv = kit.panel(kit.kicker('What to take from this'), h('p', { text: e.reveal }));
      kit.show(rv, root); ctx.complete({});
    }));
    return root;
  };
  T.exploreKinds = {};

  /* Timeline */
  T.exploreKinds.timeline = function (e, ctx, finish) {
    const [a, b] = e.range; let reached = a, done = false, timer = null;
    const yr = (y) => (y < 0 ? -y + ' BCE' : y + ' CE');
    const wrap = h('div', { class: 'timeline' });
    const label = h('div', { class: 'tl-year', text: yr(a) });
    const svgNS = 'http://www.w3.org/2000/svg';
    const W = 320, H = 70, x = (y) => 14 + ((y - a) / (b - a)) * (W - 28);
    const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'tl-svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Timeline from 800 BCE to 300 BCE');
    svg.innerHTML = `<line x1="14" y1="40" x2="${W - 14}" y2="40" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>` +
      e.events.map((ev) => `<circle class="tl-dot" data-y="${ev.y}" cx="${x(ev.y)}" cy="40" r="5" fill="${REGION_COL[ev.region]}" opacity=".25"/>`).join('') +
      `<line id="tl-now" x1="14" y1="22" x2="14" y2="58" stroke="var(--accent)" stroke-width="2"/>`;
    const legend = h('div', { class: 'legend' }, ...Object.entries(e.regions).map(([k, v]) => h('span', { class: 'lg' }, h('i', { style: { background: REGION_COL[k] } }), v)));
    const list = h('ul', { class: 'tl-list' });
    const sl = range(a, b, 1, a, 'Year', (v) => {
      ctx.interact(); update(v);
    });
    function update(v) {
      label.textContent = yr(Math.round(v));
      svg.querySelector('#tl-now').setAttribute('x1', x(v)); svg.querySelector('#tl-now').setAttribute('x2', x(v));
      C.$$('.tl-dot', svg).forEach((d) => { d.setAttribute('opacity', parseFloat(d.dataset.y) <= v ? '1' : '.25'); });
      reached = Math.max(reached, v);
      C.clear(list);
      e.events.filter((ev) => ev.y <= v).reverse().forEach((ev) => list.append(h('li', { class: 'tl-item' }, h('i', { style: { background: REGION_COL[ev.region] } }), h('div', {}, h('b', { text: yr(ev.y) + ' · ' + e.regions[ev.region] }), h('span', { text: ev.label })))));
      if (!list.children.length) list.append(h('li', { class: 'fine', text: 'Nothing yet. Drag forward.' }));
      if (!done && reached >= b - 10) { done = true; finish(); }
    }
    const play = kit.btn('Play through time', () => {
      if (timer) { clearInterval(timer); timer = null; play.textContent = 'Play through time'; return; }
      ctx.interact(); play.textContent = 'Pause';
      timer = setInterval(() => { let v = parseFloat(sl.value) + 4; if (v >= b) { v = b; clearInterval(timer); timer = null; play.textContent = 'Play through time'; } sl.value = v; update(v); }, 60);
    }, 'ghost');
    wrap.append(label, svg, sl, play, legend, list);
    update(a);
    return wrap;
  };

  /* Powers of ten */
  T.exploreKinds.scale = function (e, ctx, finish) {
    const [a, b] = e.range, visited = new Set(); let done = false, timer = null;
    const wrap = h('div', { class: 'scale' });
    const big = h('div', { class: 'scale-big' });
    const name = h('div', { class: 'scale-name' });
    const note = h('p', { class: 'scale-note' });
    const bar = h('div', { class: 'scale-ticks' }, ...e.points.map((p) => h('i', { style: { left: ((p.e - a) / (b - a)) * 100 + '%' }, title: p.label })));
    const count = h('div', { class: 'fine' });
    const sl = range(a, b, 0.1, 0, 'Size as a power of ten, in metres', (v) => { ctx.interact(); update(v); });
    function update(v) {
      big.innerHTML = '10<sup>' + (Math.round(v * 10) / 10) + '</sup> m';
      let best = e.points[0], bi = 0;
      e.points.forEach((p, i) => { if (Math.abs(p.e - v) < Math.abs(best.e - v)) { best = p; bi = i; } });
      const near = Math.abs(best.e - v) <= 1.2;
      name.textContent = near ? best.label : 'Between landmarks';
      note.textContent = near ? best.note : 'Keep going. Each step is ten times larger.';
      if (near) visited.add(bi);
      count.textContent = 'Landmarks found: ' + visited.size + ' of ' + e.points.length;
      if (!done && visited.size >= 7) { done = true; finish(); }
    }
    const play = kit.btn('Zoom out automatically', () => {
      if (timer) { clearInterval(timer); timer = null; play.textContent = 'Zoom out automatically'; return; }
      ctx.interact(); sl.value = a; play.textContent = 'Pause';
      timer = setInterval(() => { let v = parseFloat(sl.value) + 0.1; if (v >= b) { v = b; clearInterval(timer); timer = null; play.textContent = 'Zoom out automatically'; } sl.value = v; update(v); }, 90);
    }, 'ghost');
    wrap.append(big, name, note, bar, sl, h('div', { class: 'scale-ends' }, h('span', { text: 'proton' }), h('span', { text: 'observable universe' })), count, play);
    update(0);
    return wrap;
  };

  /* Mercator distortion */
  T.exploreKinds.mercator = function (e, ctx, finish) {
    let done = false;
    const wrap = h('div', { class: 'merc' });
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 320 170'); svg.setAttribute('class', 'merc-svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Two circles: one drawn at true size, one as the Mercator map would draw it at the chosen latitude');
    const info = h('div', { class: 'merc-info' });
    const lat = h('div', { class: 'tl-year' });
    function draw(v) {
      const sec = 1 / Math.cos((v * Math.PI) / 180), r0 = 16;
      svg.innerHTML = `<text x="80" y="18" text-anchor="middle" class="svg-t">True size</text><text x="240" y="18" text-anchor="middle" class="svg-t">As the map draws it</text>
        <circle cx="80" cy="90" r="${r0}" fill="var(--accent)" fill-opacity=".55" stroke="var(--accent)"/>
        <circle cx="240" cy="90" r="${Math.min(75, (r0 * sec).toFixed(1))}" fill="var(--accent)" fill-opacity=".3" stroke="var(--accent)"/>`;
      lat.textContent = v + '° latitude';
      info.textContent = `Lengths are stretched about ${sec.toFixed(1)}× and areas about ${(sec * sec).toFixed(1)}× at ${v}°.`;
      if (!done && v >= 65) { done = true; finish(); }
    }
    const sl = range(0, 80, 1, 0, 'Latitude', (v) => { ctx.interact(); draw(v); });
    const jump = (v) => { sl.value = v; ctx.interact(); draw(v); };
    wrap.append(svg, lat, sl, info,
      h('div', { class: 'row' }, kit.btn('Africa (about 5°)', () => jump(5), 'ghost small'), kit.btn('Alaska (about 64°)', () => jump(64), 'ghost small'), kit.btn('Greenland (about 72°)', () => jump(72), 'ghost small')),
      h('p', { class: 'fine', text: e.facts }));
    draw(0);
    return wrap;
  };

  /* Musical intervals */
  T.exploreKinds.intervals = function (e, ctx, finish) {
    const IV = [['Unison', 1, 1], ['Minor second', 16, 15], ['Major third', 5, 4], ['Fourth', 4, 3], ['Tritone', 45, 32], ['Fifth', 3, 2], ['Octave', 2, 1]];
    const played = new Set(); let done = false, ac = null;
    const wrap = h('div', { class: 'intervals' });
    const cv = h('canvas', { class: 'wave', width: 640, height: 150, role: 'img', 'aria-label': 'Combined waveform of the two notes' });
    const info = h('p', { class: 'scale-note', text: 'Choose an interval.' });
    const grid = h('div', { class: 'iv-grid' });
    function draw(r) {
      const g = cv.getContext('2d'), w = cv.width, ht = cv.height;
      g.clearRect(0, 0, w, ht);
      const css = getComputedStyle(cv);
      g.strokeStyle = css.getPropertyValue('--accent').trim() || '#c9a45c'; g.lineWidth = 3; g.beginPath();
      for (let x = 0; x <= w; x++) { const t = x / w, y = Math.sin(2 * Math.PI * 3 * t) + Math.sin(2 * Math.PI * 3 * r * t); const py = ht / 2 - (y / 2) * (ht / 2 - 10); x ? g.lineTo(x, py) : g.moveTo(x, py); }
      g.stroke();
    }
    function tone(freq, t0, dur, ctxA) {
      const o = ctxA.createOscillator(), g = ctxA.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctxA.currentTime + t0); g.gain.linearRampToValueAtTime(0.14, ctxA.currentTime + t0 + 0.04); g.gain.exponentialRampToValueAtTime(0.0008, ctxA.currentTime + t0 + dur);
      o.connect(g).connect(ctxA.destination); o.start(ctxA.currentTime + t0); o.stop(ctxA.currentTime + t0 + dur + 0.05);
    }
    function play(iv, btn) {
      ctx.interact();
      const r = iv[1] / iv[2];
      draw(r);
      info.textContent = `${iv[0]}: frequency ratio ${iv[1]}:${iv[2]}. ` + (iv[1] + iv[2] <= 6 ? 'A simple ratio: the waves line up often.' : iv[1] + iv[2] <= 9 ? 'A moderately simple ratio.' : 'A complex ratio: the waves rarely line up.');
      C.$$('.iv-btn', grid).forEach((b) => b.classList.remove('active')); btn.classList.add('active');
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC && C.store.state.prefs.sound) { try { ac = ac || new AC(); if (ac.state === 'suspended') ac.resume(); tone(220, 0, 0.5, ac); tone(220 * r, 0.55, 0.5, ac); tone(220, 1.15, 1.4, ac); tone(220 * r, 1.15, 1.4, ac); } catch (er) { info.textContent += ' (Audio unavailable.)'; } }
      else if (!AC) info.textContent += ' (Your browser has no Web Audio.)';
      played.add(iv[0]);
      if (!done && played.size >= 4) { done = true; setTimeout(finish, 900); }
    }
    IV.forEach((iv) => { const b = h('button', { class: 'opt iv-btn', type: 'button', onclick: () => play(iv, b) }, h('span', { class: 'iv-n', text: iv[0] }), h('span', { class: 'iv-r', text: iv[1] + ':' + iv[2] })); grid.append(b); });
    wrap.append(grid, cv, info, h('p', { class: 'fine', text: 'Tip: use headphones. Each press plays the notes one after another, then together. Try at least four.' }));
    draw(1.5);
    return wrap;
  };

  /* Wason 2-4-6 */
  T.exploreKinds.wason = function (e, ctx, finish) {
    const rule = (a, b, c) => a < b && b < c;
    const tests = []; let done = false;
    const wrap = h('div', { class: 'wason' });
    const inputs = [0, 1, 2].map((i) => h('input', { class: 'num', type: 'number', inputmode: 'decimal', step: 'any', 'aria-label': 'Number ' + (i + 1) }));
    const log = h('ul', { class: 'w-log' }, h('li', { class: 'ok' }, h('b', { text: '2, 4, 6' }), h('span', { text: 'fits the rule' })));
    const left = h('span', { class: 'fine' });
    const guessBox = h('div', { class: 'out' });
    const testBtn = kit.btn('Test this triple', () => {
      const v = inputs.map((i) => parseFloat(i.value));
      if (v.some((x) => Number.isNaN(x))) { C.toast('Enter three numbers'); return; }
      ctx.interact();
      const ok = rule(...v); tests.push({ v, ok });
      log.append(h('li', { class: ok ? 'ok' : 'no' }, h('b', { text: v.join(', ') }), h('span', { text: ok ? 'fits the rule' : 'does not fit' })));
      left.textContent = (10 - tests.length) + ' tests left';
      if (tests.length >= 10) testBtn.disabled = true;
      if (tests.length >= 2 && !guessBox.children.length) showGuess();
    });
    function showGuess() {
      const ta = h('textarea', { class: 'input', rows: 2, placeholder: 'I think the rule is…', 'aria-label': 'Your guess of the rule' });
      const go = kit.btn('Submit my guess', () => {
        if (ta.value.trim().length < 3) { C.toast('Write your guess first'); return; }
        ctx.answer('guess', ta.value.trim()); go.disabled = true; ta.disabled = true; testBtn.disabled = true;
        const no = tests.filter((t) => !t.ok).length;
        kit.show(kit.panel(kit.kicker('The rule'), h('p', { class: 'verdict-line', text: 'Any three numbers in increasing order.' }),
          h('p', { text: `You ran ${tests.length} tests. ${no} answered “no.” ` + (no === 0 ? 'Every test confirmed the pattern you expected, which is how most people miss the real rule. A test that could fail teaches more than one that cannot.' : 'Tests that could fail are the informative ones. Did your guess survive them?') })), guessBox);
        done = true; finish();
      });
      guessBox.append(kit.kicker('Ready to guess?'), ta, go);
    }
    wrap.append(h('div', { class: 'w-start', text: 'Known to fit: 2, 4, 6' }), h('div', { class: 'w-inputs' }, ...inputs, testBtn), left, log, guessBox);
    left.textContent = '10 tests left';
    return wrap;
  };

  /* ---------- Literature close reading ---------- */
  T.literature = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const seen = new Set(); let total = 0, done = false;
    const note = h('div', { class: 'lit-note', 'aria-live': 'polite' }, h('p', { class: 'fine', text: 'Tap any underlined phrase to see what the writer is doing.' }));
    const out = h('div', { class: 'out' });
    const poem = h('div', { class: 'passage', role: 'group', 'aria-label': e.work });
    e.lines.forEach((ln) => {
      const row = h('p', { class: 'pl' });
      const re = /\[\[(.+?)::(.+?)\]\]/g; let last = 0, m;
      while ((m = re.exec(ln))) {
        if (m.index > last) row.append(ln.slice(last, m.index));
        const id = total++, phrase = m[1], an = m[2];
        const b = h('button', { class: 'hl', type: 'button', onclick: () => {
          ctx.interact(); C.$$('.hl.active', poem).forEach((x) => x.classList.remove('active')); b.classList.add('active', 'seen');
          C.clear(note).append(h('strong', { text: phrase.replace(/[“”]/g, '') }), h('p', { text: an }));
          seen.add(id);
          if (!done && seen.size >= Math.min(3, total)) { done = true; conclude(); }
        } }, phrase);
        row.append(b); last = m.index + m[0].length;
      }
      if (last < ln.length) row.append(ln.slice(last));
      poem.append(row);
    });
    root.append(h('div', { class: 'lit-head' }, h('b', { text: e.author }), h('span', { text: ' · ' + e.year + ' · ' + e.form })), poem, note, out);
    function conclude() {
      kit.show(kit.panel(kit.kicker('Context'), h('p', { text: e.context }), kit.kicker('Connect it to life'), h('p', { text: e.lifeQ })), out);
      ctx.complete({});
    }
    return root;
  };

  /* ---------- Knowledge connections ---------- */
  T.connections = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const chain = h('div', { class: 'chain' });
    const out = h('div', { class: 'out' });
    e.chain.forEach((n, i) => {
      chain.append(h('div', { class: 'node', dataset: { i } }, h('div', { class: 'dot' }), h('div', {}, h('b', { text: n.name }), h('span', { text: n.sub }))));
      if (i < e.chain.length - 1) chain.append(h('div', { class: 'link', dataset: { i } }));
    });
    root.append(chain, out);
    let k = 0, right = 0;
    function ask() {
      const br = e.bridges[k], my = k;
      const card = h('div', { class: 'panel reveal' }, kit.kicker('Bridge ' + (my + 1) + ' of ' + e.bridges.length), h('p', { class: 'q', text: br.q }));
      const opts = h('div', { class: 'opts' }); card.append(opts);
      br.options.forEach((o, oi) => {
        const b = kit.opt(o, () => {
          ctx.interact(); kit.lock(opts);
          const ok = oi === br.correct; if (ok) right++;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) C.$$('.opt', opts)[br.correct].classList.add('right');
          card.append(h('p', { class: 'explain', text: (ok ? 'Yes. ' : 'Not quite. ') + br.explain }));
          const nodes = C.$$('.link', chain)[my]; if (nodes) nodes.classList.add('lit');
          C.$$('.node', chain)[my + 1] && C.$$('.node', chain)[my + 1].classList.add('lit');
          C.$$('.node', chain)[my].classList.add('lit');
          k++;
          if (k < e.bridges.length) setTimeout(ask, 250);
          else { C.$$('.node', chain).forEach((n) => n.classList.add('lit')); C.$$('.link', chain).forEach((n) => n.classList.add('lit')); kit.show(kit.panel(kit.kicker('The big picture'), h('p', { text: e.reveal }), h('p', { class: 'fine', text: right + ' of ' + e.bridges.length + ' bridges predicted' })), out); ctx.complete({}); }
        });
        opts.append(b);
      });
      kit.show(card, out);
    }
    ask();
    return root;
  };
})();
