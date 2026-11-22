/* The experience card: hook -> interaction -> takeaway -> reflection. Used by the feed, journeys, daily and saved. */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h;

  C.isSaved = (id) => C.store.state.saved.includes(id);
  C.toggleSave = function (exp, quiet) {
    const id = exp.id.startsWith('recall:') ? exp.of : exp.id;
    let on;
    C.store.update((s) => {
      if (s.saved.includes(id)) { s.saved = s.saved.filter((x) => x !== id); s.collections.forEach((c) => { c.items = c.items.filter((x) => x !== id); }); on = false; }
      else { s.saved.unshift(id); on = true; }
    });
    if (on) C.engine.signal(exp.topic, 'save');
    if (!quiet) C.toast(on ? 'Saved to your library' : 'Removed from your library', 2400, on ? { label: 'Add to collection', fn: () => C.collectionSheet(id) } : null);
    return on;
  };
  C.collectionSheet = function (id) {
    if (!C.isSaved(id)) C.toggleSave({ id, topic: C.byId[id].topic }, true);
    const body = h('div', { class: 'coll-sheet' });
    const render = () => {
      C.clear(body);
      const s = C.store.state;
      if (!s.collections.length) body.append(h('p', { class: 'fine', text: 'No collections yet. Create one below.' }));
      s.collections.forEach((c) => {
        const on = c.items.includes(id);
        body.append(h('button', { class: 'row-btn' + (on ? ' on' : ''), type: 'button', onclick: () => { C.store.update(() => { on ? (c.items = c.items.filter((x) => x !== id)) : c.items.push(id); }); render(); } },
          h('span', { text: c.name }), h('span', { class: 'fine', text: c.items.length + ' saved' }), on ? C.icon('check', 18) : null));
      });
      const inp = h('input', { class: 'input', placeholder: 'New collection name', maxlength: 40, 'aria-label': 'New collection name' });
      const add = () => { const n = inp.value.trim(); if (!n) return; C.store.update((st) => { st.collections.push({ id: 'c' + Date.now().toString(36), name: n, items: [id], created: Date.now() }); }); render(); };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
      body.append(h('div', { class: 'row new-coll' }, inp, C.tpl.kit.btn('Create', add)));
    };
    render();
    C.sheet('Add to a collection', body);
  };

  C.discussSheet = function (exp) {
    const rid = exp.id.startsWith('recall:') ? exp.of : exp.id;
    const src = C.byId[rid], ex = C.store.ex(rid);
    const body = h('div', { class: 'discuss' });
    body.append(h('p', { class: 'lead', text: src.prompt }));
    const ta = h('textarea', { class: 'input', rows: 4, placeholder: 'Write your thinking. Only you can see this.', 'aria-label': 'Your reflection' });
    ta.value = ex.reflection || '';
    const save = C.tpl.kit.btn('Save my thought', () => { C.progress.reflect(rid, ta.value); C.toast('Saved on this device'); });
    body.append(ta, save);
    const a = ex.answers || {};
    if (a.first && a.final && a.first !== a.final) body.append(h('div', { class: 'panel' }, C.tpl.kit.kicker('Your view moved'), h('p', { text: 'You began at “' + a.first + '” and ended at “' + a.final + '”.' })));
    if (src.lenses || src.perspectives) {
      const list = (src.lenses || src.perspectives).slice(0, 4);
      body.append(C.tpl.kit.kicker('Perspectives to argue with'), ...list.map((l) => h('div', { class: 'lens-row' }, h('strong', { text: l.who }), h('span', { text: ' ' + (l.view || l.text) }))));
    }
    body.append(h('div', { class: 'panel soft' }, C.tpl.kit.kicker('Community'), h('p', { class: 'fine', text: 'This version keeps everything on your device, so there is no real community discussion yet. When a backend is added (see docs/ARCHITECTURE.md), responses here can be shared and compared with real people.' }), h('button', { class: 'btn ghost', disabled: true, type: 'button' }, 'Post publicly (needs a backend)')));
    C.sheet('Think it over', body);
  };

  C.Card = {
    /**
     * @param exp   experience (or generated recall)
     * @param o     {why, mode, onComplete, onNext}
     */
    create(exp, o = {}) {
      const t = C.topic(exp.topic), isRecall = exp.type === 'recall' || exp.type === 'drill', isDrill = exp.type === 'drill';
      const sid = isRecall ? exp.of : exp.id;
      const ex = isRecall ? { answers: {} } : C.store.ex(exp.id);
      const state = { begun: false, completed: false, interacted: false, tplNode: null, artDone: false };
      const el = h('article', { class: 'card', dataset: { id: exp.id, topic: exp.topic }, style: { '--accent': t.color }, 'aria-label': exp.title, tabindex: '-1' });
      const art = h('div', { class: 'art' });
      const chips = h('div', { class: 'card-top' },
        h('span', { class: 'chip topic', text: t.short }), h('span', { class: 'chip', text: C.FORMATS[exp.type].name }), h('span', { class: 'chip dim', text: exp.mins + ' min' }),
        o.why === 'explore' ? h('span', { class: 'chip why', text: 'Outside your usual orbit' }) : null,
        o.why === 'follow' ? h('span', { class: 'chip why', text: 'From what you follow' }) : null,
        o.why === 'review' ? h('span', { class: 'chip why', text: 'Memory check' }) : null,
        o.why === 'revisit' ? h('span', { class: 'chip why', text: 'Revisit' }) : null,
        !isRecall && ex.done && o.why !== 'revisit' ? h('span', { class: 'chip done', text: 'Completed' }) : null);
      const mount = h('div', { class: 'tpl-mount' });
      const takeaway = h('section', { class: 'takeaway', hidden: true, 'aria-live': 'polite' });
      const intro = h('div', { class: 'intro' },
        h('h2', { class: 'title', text: exp.title }), h('p', { class: 'hook', text: exp.hook }),
        h('div', { class: 'begin-row' }, h('button', { class: 'begin', type: 'button', onclick: () => begin() }, h('span', { text: C.FORMATS[exp.type].verb }), C.icon('right', 18)), h('span', { class: 'fine', text: C.FORMATS[exp.type].blurb })));
      const active = h('div', { class: 'active-body', hidden: true }, h('h2', { class: 'title-sm', text: exp.title }), mount, takeaway);
      const inner = h('div', { class: 'card-inner' }, intro, active);
      const scroller = h('div', { class: 'card-scroll' }, inner);
      const spark = h('button', { class: 'rail-btn' + (ex.liked ? ' on' : ''), type: 'button', 'aria-label': 'Spark: mark as fascinating', 'aria-pressed': String(!!ex.liked), onclick: () => {
        C.store.update(() => { const x = C.store.ex(sid); x.liked = !x.liked; spark.classList.toggle('on', x.liked); spark.setAttribute('aria-pressed', String(x.liked)); if (x.liked) C.engine.signal(exp.topic, 'like'); });
      } }, C.icon('spark', 24), h('span', { text: 'Spark' }));
      const save = h('button', { class: 'rail-btn' + (C.isSaved(sid) ? ' on' : ''), type: 'button', 'aria-label': 'Save', 'aria-pressed': String(C.isSaved(sid)), onclick: () => { const on = C.toggleSave(exp); save.classList.toggle('on', on); save.setAttribute('aria-pressed', String(on)); } }, C.icon('bookmark', 24), h('span', { text: 'Save' }));
      const rail = isDrill ? h('aside', { class: 'rail' }) : h('aside', { class: 'rail' }, spark, save,
        h('button', { class: 'rail-btn', type: 'button', 'aria-label': 'Reflect and discuss', onclick: () => C.discussSheet(exp) }, C.icon('chat', 24), h('span', { text: 'Think' })),
        h('button', { class: 'rail-btn', type: 'button', 'aria-label': 'Share', onclick: () => C.social.share(C.byId[sid]) }, C.icon('share', 24), h('span', { text: 'Share' })));
      const hint = h('div', { class: 'next-hint', 'aria-hidden': 'true' }, C.icon('down', 20));
      el.append(art, h('div', { class: 'scrim' }), chips, scroller, rail, hint);

      const ctx = {
        interact() { state.interacted = true; },
        answer(k, v) { if (!isRecall) C.store.update(() => { ex.answers[k] = v; }); },
        prev(k) { return ex.answers ? ex.answers[k] : undefined; },
        complete(info) {
          if (state.completed) return;
          state.completed = true; state.interacted = true;
          let gained = 0;
          if (!isRecall) { const r = C.progress.complete(exp, info); gained = r.gained; }
          el.classList.add('completed');
          if (isDrill) { if (o.onNext) takeaway.hidden = false, takeaway.append(h('div', { class: 'row tk-actions' }, C.tpl.kit.btn(o.nextLabel || 'Next', () => o.onNext(), 'primary'))); }
          else renderTakeaway(gained, info);
          o.onComplete && o.onComplete(exp, info);
        }
      };

      function renderTakeaway(gained, info) {
        takeaway.hidden = false;
        const src = C.byId[sid];
        const ta = h('textarea', { class: 'input', rows: 3, placeholder: 'One line on what this changed in how you think (optional)', 'aria-label': 'Your reflection' });
        ta.value = (ex && ex.reflection) || '';
        let tm; ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { if (ta.value.trim().length >= 20) C.progress.reflect(sid, ta.value); else if (!isRecall) C.store.update(() => { ex.reflection = ta.value; }); }, 900); });
        const related = C.library.filter((x) => x.id !== sid && !(C.store.state.exp[x.id] && C.store.state.exp[x.id].done) && ((src.links || []).includes(x.topic) || x.topic === src.topic || (x.thinkers || []).some((n) => (src.thinkers || []).includes(n)))).sort(() => Math.random() - 0.5).slice(0, 2);
        takeaway.append(
          h('div', { class: 'tk-head' }, C.tpl.kit.kicker('Takeaway'), gained ? h('span', { class: 'xp-chip', text: '+' + gained + ' insight' }) : null),
          h('p', { class: 'tk-text', text: src.takeaway }),
          C.holes ? C.holes.takeawayBlock(sid) : null,
          h('div', { class: 'tk-q' }, h('b', { text: 'Think it over' }), h('p', { text: src.prompt }), ta),
          C.mirror ? C.mirror.card({ id: sid, topic: src.topic, title: src.title, claim: src.takeaway }) : null,
          (src.links || []).length ? h('div', { class: 'tk-links' }, h('span', { class: 'fine', text: 'Connects to' }), ...src.links.map((l) => h('a', { class: 'chip link', href: '#/explore/topic/' + l, text: C.topic(l).short }))) : null,
          related.length ? h('div', { class: 'tk-more' }, h('span', { class: 'fine', text: 'Go further' }), ...related.map((r) => h('a', { class: 'more-link', href: '#/x/' + r.id }, h('b', { text: r.title }), h('span', { text: C.FORMATS[r.type].name + ' · ' + r.mins + ' min' })))) : null,
          h('div', { class: 'row tk-actions' },
            C.tpl.kit.btn('Share image', () => C.social.shareImageFlow(src).then(() => { C.store.update((s) => { s.stats.shares++; }); C.progress.check(); }), 'ghost small'),
            C.tpl.kit.btn('Add to collection', () => C.collectionSheet(sid), 'ghost small'),
            o.onNext ? C.tpl.kit.btn(o.nextLabel || 'Next', () => o.onNext(), 'primary') : null));
        setTimeout(() => { const sc = scroller; const top = takeaway.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 70; sc.scrollTo({ top, behavior: C.reducedMotion() ? 'auto' : 'smooth' }); }, 350);
      }

      function begin() {
        if (state.begun) return;
        state.begun = true; state.interacted = true;
        intro.hidden = true; active.hidden = false; el.classList.add('begun');
        try { state.tplNode = C.tpl[exp.type](exp, ctx); mount.append(state.tplNode); }
        catch (err) { console.error(err); mount.append(h('p', { class: 'fine', text: 'Something went wrong loading this experience.' })); }
        scroller.scrollTo({ top: 0 });
        if (!isRecall) { const x = C.store.ex(sid); if (x.done && o.why !== 'revisit') { /* allow replays */ } }
      }
      intro.addEventListener('click', (e) => { if (!e.target.closest('a,button')) begin(); });

      return {
        el, exp, state, begin, ctx,
        renderArt() { if (!state.artDone) { art.innerHTML = C.art(exp); state.artDone = true; } },
        activate() { state.t0 = performance.now(); if (!isRecall) { C.store.update((s) => { const x = C.store.ex(sid); x.views++; x.seenAt = Date.now(); C.store.tp(exp.topic).views++; }); } },
        deactivate() {
          const dwell = (performance.now() - (state.t0 || performance.now())) / 1000;
          if (isRecall) return;
          C.store.update(() => { C.store.ex(sid).dwell += dwell; });
          if (state.interacted || dwell > 6) C.engine.signal(exp.topic, 'view');
          else if (dwell < 2.5) C.engine.signal(exp.topic, 'skip');
        }
      };
    }
  };
})();
