/* Format renderers, part 3: apply, predict, spot, layers, recall */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, T = C.tpl, kit = T.kit;

  /* ---------- Real-life application ---------- */
  T.apply = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    root.append(h('p', { class: 'lead', text: e.intro }));
    const out = h('div', { class: 'out' });
    if (e.kind === 'sort') {
      const rows = h('div', { class: 'sort-list' });
      let n = 0;
      e.items.forEach((it, idx) => {
        const fb = h('div', { class: 'sort-fb' });
        const btns = h('div', { class: 'sort-btns' });
        e.buckets.forEach((bk) => {
          const b = h('button', { class: 'chip', type: 'button', onclick: () => {
            ctx.interact(); kit.lock(btns); b.classList.add('chosen'); ctx.answer('i' + idx, bk.id);
            const match = bk.id === it.a;
            fb.append(h('span', { class: match ? 'ok-t' : 'diff-t', text: match ? 'Matches the usual sort. ' : 'Suggested: ' + e.buckets.find((x) => x.id === it.a).label + '. ' }), it.why);
            n++;
            if (n === e.items.length) { kit.show(kit.panel(kit.kicker('The practice'), h('p', { text: e.closing })), out); ctx.complete({}); }
          } }, bk.label);
          btns.append(b);
        });
        rows.append(h('div', { class: 'sort-row' }, h('p', { text: it.t }), btns, fb));
      });
      root.append(rows, out);
      return root;
    }
    const tas = e.prompts.map((p, i) => {
      const ta = h('textarea', { class: 'input', rows: 3, placeholder: p.ph, 'aria-label': p.q });
      ta.value = ctx.prev('p' + i) || '';
      let t; ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => ctx.answer('p' + i, ta.value), 300); check(); });
      root.append(h('div', { class: 'field' }, h('label', { class: 'q', text: (i + 1) + '. ' + p.q }), ta));
      return ta;
    });
    const go = kit.btn('I have done this', () => {
      tas.forEach((t, i) => ctx.answer('p' + i, t.value));
      go.disabled = true; tas.forEach((t) => { t.disabled = true; });
      kit.show(kit.panel(kit.kicker('Why it works'), h('p', { text: e.closing })), out);
      ctx.complete({});
    });
    go.disabled = true;
    function check() { ctx.interact(); go.disabled = !tas.every((t) => t.value.trim().length >= 8); }
    root.append(go, out);
    return root;
  };

  /* ---------- Predict & reveal ---------- */
  const fmtNum = (n) => (n >= 1000 ? n.toLocaleString('en-US') : String(Math.round(n * 100) / 100));
  T.predict = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    root.append(h('p', { class: 'lead', text: e.q }));
    if (e.mode === 'choice') {
      const opts = h('div', { class: 'opts' });
      e.options.forEach((o, i) => {
        const b = kit.opt(o, () => {
          ctx.interact(); kit.lock(opts); ctx.answer('guess', i);
          b.classList.add('chosen'); C.$$('.opt', opts)[e.truthIndex].classList.add('right'); if (i !== e.truthIndex) b.classList.add('wrong');
          kit.show(kit.panel(kit.kicker(i === e.truthIndex ? 'Right' : 'Not quite'), h('p', { text: e.explain })), out);
          if (e.sim) out.append(monty());
          ctx.complete({});
        });
        opts.append(b);
      });
      root.append(opts, out);
      return root;
    }
    const lg = !!e.log;
    const toVal = (t) => (lg ? e.min * Math.pow(e.max / e.min, t / 1000) : e.min + (t / 1000) * (e.max - e.min));
    let cur = toVal(500);
    const readout = h('div', { class: 'predict-val' });
    const show = () => { cur = lg ? Math.round(cur) : Math.round(cur / e.step) * e.step; readout.textContent = fmtNum(cur) + ' ' + e.unit; };
    const sl = h('input', { type: 'range', class: 'slider', min: 0, max: 1000, value: 500, 'aria-label': 'Your estimate' });
    sl.addEventListener('input', () => { ctx.interact(); cur = toVal(parseFloat(sl.value)); show(); });
    show();
    const lock = kit.btn('Lock in my guess', () => {
      lock.disabled = true; sl.disabled = true; ctx.answer('guess', cur);
      const pos = (v) => (lg ? Math.log(v / e.min) / Math.log(e.max / e.min) : (v - e.min) / (e.max - e.min)) * 100;
      const diff = lg ? cur / e.truth : cur - e.truth;
      let verdict;
      if (lg) verdict = Math.abs(Math.log(cur / e.truth)) <= Math.log(1 + e.tolerance) ? 'Very close.' : cur > e.truth ? 'About ' + (cur / e.truth).toFixed(1) + '× too high.' : 'About ' + (e.truth / cur).toFixed(1) + '× too low.';
      else verdict = Math.abs(diff) <= e.tolerance ? 'Very close.' : diff > 0 ? 'Too high by ' + Math.abs(diff) + '.' : 'Too low by ' + Math.abs(diff) + '.';
      const track = h('div', { class: 'reveal-track' },
        h('div', { class: 'mark you', style: { left: C.clamp(pos(cur), 2, 98) + '%' } }, h('span', { text: 'You' })),
        h('div', { class: 'mark truth', style: { left: C.clamp(pos(e.truth), 2, 98) + '%' } }, h('span', { text: 'Answer' })));
      kit.show(kit.panel(kit.kicker('Answer: ' + fmtNum(e.truth) + ' ' + e.unit), track, h('p', { class: 'verdict-line', text: 'You guessed ' + fmtNum(cur) + '. ' + verdict }), h('p', { text: e.explain })), out);
      ctx.complete({});
    });
    root.append(readout, sl, h('div', { class: 'scale-ends' }, h('span', { text: fmtNum(e.min) }), h('span', { text: fmtNum(e.max) })), lock, out);
    return root;
  };
  function monty() {
    const box = h('div', { class: 'panel reveal' }, kit.kicker('Simulator'), h('p', { class: 'fine', text: 'Plays 1,000 games of each strategy using random doors.' }));
    const res = h('div', { class: 'sim-res' });
    const run = kit.btn('Run 1,000 games', () => {
      let stay = 0, sw = 0;
      for (let i = 0; i < 1000; i++) { const car = Math.floor(Math.random() * 3), pick = Math.floor(Math.random() * 3); if (pick === car) stay++; else sw++; }
      C.clear(res).append(
        ...[['Always stay', stay], ['Always switch', sw]].map(([l, v]) => h('div', { class: 'bar-row' }, h('div', { class: 'bar-label', text: l }), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: v / 10 + '%' } })), h('div', { class: 'bar-pct', text: v / 10 + '%' }))));
    }, 'ghost');
    box.append(run, res);
    return box;
  }

  /* ---------- Spot the flaw ---------- */
  T.spot = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    root.append(h('p', { class: 'lead', text: e.intro }));
    let right = 0, n = 0;
    const out = h('div', { class: 'out' });
    e.items.forEach((it, idx) => {
      const card = h('div', { class: 'panel spot-card' }, h('div', { class: 'kicker', text: 'Argument ' + (idx + 1) + ' of ' + e.items.length }), h('blockquote', { class: 'claim', text: it.arg }));
      const opts = h('div', { class: 'opts two' });
      it.options.forEach((o, oi) => {
        const b = kit.opt(o, () => {
          ctx.interact(); kit.lock(opts);
          const ok = oi === it.correct; if (ok) right++;
          b.classList.add(ok ? 'right' : 'wrong'); if (!ok) C.$$('.opt', opts)[it.correct].classList.add('right');
          card.append(h('p', { class: 'explain', text: it.explain }));
          n++; ctx.answer('s' + idx, oi);
          if (n === e.items.length) { kit.show(kit.panel(kit.kicker('Score'), h('p', { class: 'verdict-line', text: right + ' of ' + e.items.length + ' spotted' }), h('p', { text: 'The goal is not a perfect score. It is a sharper eye.' })), out); ctx.complete({}); }
        });
        opts.append(b);
      });
      card.append(opts); root.append(card);
    });
    root.append(out);
    return root;
  };

  /* ---------- Layered deep dive ---------- */
  T.layers = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    root.append(kit.kicker('Make a guess first'), h('p', { class: 'lead', text: e.guess.q }));
    const opts = h('div', { class: 'opts' });
    e.guess.options.forEach((o, i) => {
      const b = kit.opt(o, () => {
        ctx.interact(); kit.lock(opts); ctx.answer('guess', i);
        b.classList.add(i === e.guess.answer ? 'right' : 'wrong'); C.$$('.opt', opts)[e.guess.answer].classList.add('right');
        out.append(h('p', { class: 'verdict-line', text: i === e.guess.answer ? 'Good instinct. Now go deeper.' : 'Not what most expect. Now go deeper.' }));
        let k = 0;
        const more = kit.btn('', () => next());
        const stack = h('div', { class: 'layer-stack' });
        out.append(stack, more);
        function next() {
          const L = e.layers[k++];
          kit.show(h('div', { class: 'layer reveal', style: { '--d': k } }, h('div', { class: 'layer-n', text: String(k) }), h('div', {}, h('b', { text: L.h }), h('p', { text: L.t }))), stack);
          if (k < e.layers.length) more.textContent = 'Go deeper (' + (k + 1) + ' of ' + e.layers.length + ')';
          else { more.remove(); ctx.complete({}); }
        }
        more.textContent = 'Go deeper (1 of ' + e.layers.length + ')';
      });
      opts.append(b);
    });
    root.append(opts, out);
    return root;
  };

  /* ---------- Memory check (generated) ---------- */
  T.recall = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const orig = C.byId[e.of];
    root.append(h('p', { class: 'lead', text: 'Which takeaway belongs to “' + orig.title + '”?' }));
    const opts = h('div', { class: 'opts' }), out = h('div', { class: 'out' });
    e.options.forEach((o) => {
      const b = kit.opt(o.t, () => {
        ctx.interact(); kit.lock(opts); b.classList.add(o.ok ? 'right' : 'wrong');
        C.$$('.opt', opts)[e.options.findIndex((x) => x.ok)].classList.add('right');
        C.progress.recall(e.of, o.ok);
        const st = C.store.state.exp[e.of];
        kit.show(kit.panel(h('p', { class: 'verdict-line', text: o.ok ? 'Remembered. +3' : 'Not this time. It will come back sooner.' }),
          h('p', { class: 'fine', text: 'Next check in about ' + ({ 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 }[st.box]) + ' day(s).' })), out);
        ctx.complete({ recall: true });
      });
      opts.append(b);
    });
    root.append(opts, out);
    return root;
  };
})();
