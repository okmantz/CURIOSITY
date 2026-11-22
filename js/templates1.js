/* Format renderers, part 1: thought, history, challenge, socratic, perspectives, debate.
   Each renderer: (exp, ctx) => HTMLElement. ctx = {answer(k,v), prev(k), complete(info), interact()} */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h;
  const T = (C.tpl = C.tpl || {});

  /* ---------- Shared kit ---------- */
  const kit = (T.kit = {
    opt(label, onclick, cls = '') { return h('button', { class: 'opt ' + cls, type: 'button', onclick }, h('span', { class: 'opt-text', text: label })); },
    btn(label, onclick, cls = 'primary') { return h('button', { class: 'btn ' + cls, type: 'button', onclick }, label); },
    kicker(t) { return h('div', { class: 'kicker', text: t }); },
    panel(...kids) { return h('div', { class: 'panel reveal' }, ...kids); },
    /** Append node and gently scroll the card's own scroller to it (never the feed). */
    show(node, parent) {
      parent.append(node);
      requestAnimationFrame(() => {
        const sc = node.closest('.card-scroll');
        if (!sc) return;
        const top = node.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 90;
        sc.scrollTo({ top: Math.max(0, top), behavior: C.reducedMotion() ? 'auto' : 'smooth' });
      });
      return node;
    },
    lock(container) { C.$$('button', container).forEach((b) => { b.disabled = true; }); },
    mark(btn) { btn.classList.add('chosen'); },
    community(expId, key, labels, mine) {
      const d = C.social.sample(expId, key, labels);
      return h('div', { class: 'community' },
        h('div', { class: 'kicker', text: 'Community perspectives (illustrative sample)' }),
        ...d.labels.map((l, i) => h('div', { class: 'bar-row' + (i === mine ? ' mine' : '') },
          h('div', { class: 'bar-label' }, l, i === mine ? h('span', { class: 'you', text: ' (you)' }) : null),
          h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: d.pct[i] + '%' } })),
          h('div', { class: 'bar-pct', text: d.pct[i] + '%' }))),
        h('p', { class: 'fine', text: 'Simulated demo data. It is not from real people, because this version has no shared backend. Real community responses can be added later.' }));
    },
    seeAnswers(ctx, key, labelFor) {
      const p = ctx.prev(key);
      return p ? h('p', { class: 'fine', text: 'Last time you chose: ' + labelFor(p) }) : null;
    }
  });

  /* ---------- Thought experiment ---------- */
  T.thought = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    const opts = h('div', { class: 'opts' });
    root.append(h('p', { class: 'lead', text: e.scenario }), kit.kicker('What do you do?'), opts, out);
    const prev = kit.seeAnswers(ctx, 'choice', (id) => (e.choices.find((c) => c.id === id) || {}).label);
    if (prev) root.insertBefore(prev, opts);
    e.choices.forEach((c, i) => {
      const b = kit.opt(c.label, () => {
        kit.lock(opts); kit.mark(b); ctx.interact(); ctx.answer('choice', c.id);
        kit.show(kit.panel(kit.kicker('What your choice reveals'), h('p', { text: c.result }), h('p', { class: 'lens', text: c.lens }),
          kit.community(e.id, 'choice', e.choices.map((x) => x.label), i)), out);
        const more = kit.btn('Hear the thinkers', () => {
          more.remove();
          kit.show(kit.panel(kit.kicker('How others have approached it'), ...e.lenses.map((l) => h('div', { class: 'lens-row' }, h('strong', { text: l.who }), h('span', { text: ' ' + l.view })))), out);
          ctx.complete({});
        });
        out.append(more);
      });
      opts.append(b);
    });
    return root;
  };

  /* ---------- Interactive history ---------- */
  T.history = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    const opts = h('div', { class: 'opts' });
    root.append(
      h('div', { class: 'date-chip', text: e.date }), h('p', { class: 'role', text: e.role }),
      h('ul', { class: 'facts' }, ...e.facts.map((f) => h('li', { text: f }))),
      kit.kicker('What is your decision?'), opts, out);
    e.options.forEach((o) => {
      const b = kit.opt(o.label, () => {
        kit.lock(opts); kit.mark(b); ctx.interact(); ctx.answer('choice', o.id);
        kit.show(kit.panel(kit.kicker('Your path, assessed'), h('p', { text: o.think })), out);
        const go = kit.btn('See what really happened', () => {
          go.remove();
          const act = e.options.find((x) => x.id === e.actual);
          kit.show(kit.panel(
            kit.kicker('What actually happened'),
            h('p', { class: 'verdict-line', text: o.id === e.actual ? 'You chose what was actually done.' : 'The actual decision: ' + act.label + '.' }),
            h('p', { text: e.outcome }),
            kit.kicker('Why it matters'), h('p', { text: e.why }),
            e.sources ? h('p', { class: 'fine', text: 'Sources: ' + e.sources }) : null), out);
          ctx.complete({});
        });
        out.append(go);
      });
      opts.append(b);
    });
    return root;
  };

  /* ---------- Philosophical challenge ---------- */
  T.challenge = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    const opts = h('div', { class: 'opts' });
    root.append(h('blockquote', { class: 'claim', text: e.claim }), kit.kicker('Where do you stand?'), opts, out);
    let first = null;
    e.stances.forEach((st, i) => {
      const b = kit.opt(st.label, () => {
        kit.lock(opts); kit.mark(b); ctx.interact(); first = st; ctx.answer('first', st.id);
        let idx = 0;
        const list = h('div', { class: 'pv-list' });
        kit.show(h('div', { class: 'panel reveal' }, kit.kicker('Now hear the perspectives'), list), out);
        const nextBtn = kit.btn('', () => step());
        out.append(nextBtn);
        function step() {
          const p = e.perspectives[idx++];
          kit.show(h('div', { class: 'lens-card' }, h('strong', { text: p.who }), h('p', { text: p.view })), list);
          if (idx < e.perspectives.length) nextBtn.textContent = 'Next perspective (' + (idx + 1) + ' of ' + e.perspectives.length + ')';
          else { nextBtn.remove(); finish(); }
        }
        nextBtn.textContent = 'First perspective';
        function finish() {
          kit.show(kit.panel(kit.kicker('Where this leaves us'), h('p', { text: e.verdict })), out);
          const again = h('div', { class: 'opts' });
          out.append(kit.kicker('Has your view changed? Choose again.'), again);
          e.stances.forEach((s2, j) => {
            const b2 = kit.opt(s2.label, () => {
              kit.lock(again); kit.mark(b2); ctx.answer('second', s2.id);
              const changed = s2.id !== first.id;
              kit.show(kit.panel(h('p', { text: changed ? 'You changed your mind. Updating a view in light of arguments is the point of the exercise.' : 'You held your position. Check: could you now state the strongest case against it?' }),
                kit.community(e.id, 'stance', e.stances.map((x) => x.label), j)), out);
              ctx.complete({ changedMind: changed });
            });
            again.append(b2);
          });
        }
      });
      opts.append(b);
    });
    return root;
  };

  /* ---------- Socratic conversation ---------- */
  T.socratic = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const chat = h('div', { class: 'chat' });
    const choices = h('div', { class: 'opts sticky-choices' });
    root.append(h('p', { class: 'lead', text: e.intro }), chat, choices);
    const bubble = (who, text) => kit.show(h('div', { class: 'bubble ' + who }, h('span', { class: 'who', text: who === 'soc' ? 'Socrates' : 'You' }), h('p', { text })), chat);
    let i = 0;
    function ask() {
      const st = e.steps[i];
      bubble('soc', st.q);
      C.clear(choices);
      st.choices.forEach((c, k) => {
        const b = kit.opt(c.label, () => {
          ctx.interact(); ctx.answer('step' + i, k);
          bubble('you', c.label);
          C.clear(choices);
          setTimeout(() => {
            bubble('soc', c.reply);
            i++;
            if (i < e.steps.length) setTimeout(ask, C.reducedMotion() ? 0 : 700);
            else setTimeout(() => { kit.show(kit.panel(kit.kicker('Where the dialogue leads'), h('p', { text: e.conclusion })), chat); ctx.complete({}); }, 600);
          }, 350);
        });
        choices.append(b);
      });
    }
    ask();
    return root;
  };

  /* ---------- Perspective shift ---------- */
  T.perspectives = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const opened = new Set();
    const tabs = h('div', { class: 'lens-tabs', role: 'tablist' });
    const body = h('div', { class: 'lens-body', role: 'tabpanel' }, h('p', { class: 'fine', text: 'Tap a perspective to read it. Open at least three.' }));
    const out = h('div', { class: 'out' });
    root.append(h('p', { class: 'lead', text: e.situation }), tabs, body, out);
    let finished = false;
    e.lenses.forEach((l, i) => {
      const t = h('button', { class: 'lens-tab', role: 'tab', type: 'button', onclick: () => {
        ctx.interact();
        C.$$('.lens-tab', tabs).forEach((x) => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
        t.classList.add('active'); t.setAttribute('aria-selected', 'true'); t.classList.add('seen');
        opened.add(i);
        C.clear(body).append(h('div', { class: 'lens-card' }, h('div', { class: 'tag', text: l.tag }), h('strong', { text: l.who }), h('p', { text: l.text })));
        if (opened.size >= 3 && !finished) { finished = true; conclude(); }
      } }, h('span', { text: l.who.split(' (')[0] }));
      tabs.append(t);
    });
    function conclude() {
      out.append(kit.kicker('Which one is closest to how you would actually respond?'));
      const o = h('div', { class: 'opts' }); out.append(o);
      e.lenses.forEach((l, i) => {
        const b = kit.opt(l.who.split(' (')[0] + ': ' + l.tag, () => {
          kit.lock(o); kit.mark(b); ctx.answer('pick', i);
          kit.show(kit.panel(kit.kicker('Compare'), h('p', { text: e.closing }), kit.community(e.id, 'pick', e.lenses.map((x) => x.who.split(' (')[0]), i)), out);
          ctx.complete({});
        });
        o.append(b);
      });
    }
    return root;
  };

  /* ---------- Debate ---------- */
  T.debate = function (e, ctx) {
    const root = h('div', { class: 'tpl' });
    const out = h('div', { class: 'out' });
    const opts = h('div', { class: 'opts' });
    root.append(h('h3', { class: 'q', text: e.question }), kit.kicker('Your starting position'), opts, out);
    const sideCard = (s, title) => h('div', { class: 'panel reveal' }, kit.kicker(title), h('strong', { text: s.label }), h('ul', { class: 'facts' }, ...s.case.map((c) => h('li', { text: c }))));
    const choose = (id) => e.sides.find((s) => s.id === id);
    const stances = [...e.sides.map((s) => ({ id: s.id, label: s.label })), { id: 'unsure', label: 'Undecided. Show me both' }];
    stances.forEach((st) => {
      const b = kit.opt(st.label, () => {
        kit.lock(opts); kit.mark(b); ctx.interact(); ctx.answer('first', st.id);
        const mine = st.id === 'unsure' ? e.sides[0] : choose(st.id);
        const other = e.sides.find((s) => s !== mine);
        kit.show(sideCard(mine, st.id === 'unsure' ? 'Start with this case' : 'The strongest case for your side'), out);
        const b1 = kit.btn('Challenge it', () => {
          b1.remove();
          kit.show(kit.panel(kit.kicker('The strongest objection'), h('p', { text: mine.objection })), out);
          const b2 = kit.btn('Hear the other side', () => {
            b2.remove();
            kit.show(sideCard(other, 'The opposing case'), out);
            kit.show(kit.panel(kit.kicker('And its strongest objection'), h('p', { text: other.objection })), out);
            out.append(kit.kicker('After both sides, where do you stand now?'));
            const fin = h('div', { class: 'opts' }); out.append(fin);
            const finals = [...e.sides.map((s) => ({ id: s.id, label: s.label })), { id: 'unsure', label: 'Still undecided, and I know why' }];
            finals.forEach((f, j) => {
              const b3 = kit.opt(f.label, () => {
                kit.lock(fin); kit.mark(b3); ctx.answer('final', f.id);
                const changed = f.id !== st.id && !(st.id === 'unsure');
                const note = st.id === 'unsure' ? 'You began undecided and now lean one way. That is reasoning from evidence.' : changed ? 'You moved. Changing your mind after hearing the strongest opposing case takes intellectual courage.' : 'You held your ground, now knowing the best objection. That is stronger than where you started.';
                kit.show(kit.panel(h('p', { text: note }), h('p', { text: e.closing }), kit.community(e.id, 'final', finals.map((x) => x.label.split(',')[0]), j)), out);
                ctx.complete({ changedMind: changed });
              });
              fin.append(b3);
            });
          });
          out.append(b2);
        });
        out.append(b1);
      });
      opts.append(b);
    });
    return root;
  };
})();
