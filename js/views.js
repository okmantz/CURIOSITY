/* Page views: Explore, Journeys, Saved, Daily, plus shared list pieces */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h;
  const V = (C.views = {});
  const S = () => C.store.state;

  /* ---------- Shared pieces ---------- */
  V.page = (title, sub, ...kids) => h('div', { class: 'page' }, h('header', { class: 'page-head' }, h('h1', { text: title }), sub ? h('p', { class: 'sub', text: sub }) : null), ...kids);
  V.back = (href, label) => h('a', { class: 'back', href }, C.icon('left', 18), label || 'Back');
  V.progressBar = (pct, color) => h('div', { class: 'pbar' }, h('div', { class: 'pbar-fill', style: { width: Math.round(C.clamp(pct, 0, 1) * 100) + '%', background: color || 'var(--accent)' } }));
  V.listItem = function (e) {
    const x = S().exp[e.id], t = C.topic(e.topic);
    return h('a', { class: 'list-item', href: '#/x/' + e.id, style: { '--accent': t.color } },
      h('span', { class: 'li-dot' }),
      h('div', { class: 'li-main' }, h('b', { text: e.title }), h('span', { class: 'fine', text: t.short + ' · ' + C.FORMATS[e.type].name + ' · ' + e.mins + ' min' })),
      x && x.done ? h('span', { class: 'li-done', title: 'Completed' }, C.icon('check', 18)) : null);
  };
  V.topicTile = function (t) {
    const total = C.library.filter((e) => e.topic === t.id).length, tp = C.store.tp(t.id);
    const done = C.library.filter((e) => e.topic === t.id && S().exp[e.id] && S().exp[e.id].done).length;
    const m = C.progress.masteryInfo(t.id);
    const art = h('div', { class: 'tile-art', html: C.art({ id: 'tile-' + t.id, topic: t.id }) });
    return h('a', { class: 'tile', href: '#/explore/topic/' + t.id, style: { '--accent': t.color } }, art,
      h('div', { class: 'tile-body' }, h('b', { text: t.short }), h('span', { class: 'fine', text: done + ' / ' + total + ' · ' + m.name }), V.progressBar(total ? done / total : 0)));
  };

  /* ---------- Explore ---------- */
  V.explore = function () {
    const root = V.page('Explore', 'Wander by subject, format or thinker. Everything is a doorway.');
    const results = h('div', { class: 'results' });
    const input = h('input', { class: 'input search', type: 'search', placeholder: 'Search ideas, thinkers, subjects…', 'aria-label': 'Search' });
    input.addEventListener('input', () => {
      C.clear(results);
      const r = C.search(input.value);
      if (input.value.trim() && !r.length) results.append(h('p', { class: 'fine', text: 'Nothing matched. Try a thinker’s name or a topic like “paradox.”' }));
      r.slice(0, 12).forEach((e) => results.append(V.listItem(e)));
    });
    root.append(h('div', { class: 'search-wrap' }, C.icon('search', 18), input), results);

    root.append(h('h2', { class: 'sec', text: 'Go deeper' }), h('div', { class: 'doors' },
      h('a', { class: 'door', href: '#/holes' }, h('span', { class: 'door-ic' }, C.icon('hole', 22)), h('div', { class: 'door-main' }, h('span', { class: 'kicker', text: 'Rabbit Holes' }), h('b', { text: 'One idea, many ways in' }), h('span', { class: 'fine', text: 'Original sources, interactives, objections and modern echoes for every idea.' })), C.icon('right', 18)),
      h('a', { class: 'door', href: '#/atlas' }, h('span', { class: 'door-ic' }, C.icon('atlas', 22)), h('div', { class: 'door-main' }, h('span', { class: 'kicker', text: 'The Atlas' }), h('b', { text: C.atlas ? C.atlas.questions().toLocaleString('en-US') + ' questions across 12 subjects' : 'Questions across 12 subjects' }), h('span', { class: 'fine', text: 'Generated from fact tables: dates, people, places, ideas. Study or play.' })), C.icon('right', 18)),
      h('a', { class: 'door', href: '#/mirror' }, h('span', { class: 'door-ic' }, C.icon('mirror', 22)), h('div', { class: 'door-main' }, h('span', { class: 'kicker', text: 'The Mirror' }), h('b', { text: 'How you reason' }), h('span', { class: 'fine', text: 'Questions about your thinking, never about whether you are right.' })), C.icon('right', 18))));
    root.append(h('h2', { class: 'sec', text: 'Subjects' }), h('div', { class: 'tiles' }, ...C.TOPICS.map(V.topicTile)));

    root.append(h('h2', { class: 'sec', text: 'Curated collections' }),
      h('div', { class: 'hscroll' }, ...C.COLLECTIONS.map((c) => h('a', { class: 'coll-card', href: '#/explore/collection/' + c.id },
        h('b', { text: c.title }), h('span', { class: 'fine', text: c.blurb }), h('span', { class: 'fine', text: c.ids.length + ' experiences' })))));

    root.append(h('h2', { class: 'sec', text: 'Browse by format' }),
      h('div', { class: 'fmt-grid' }, ...Object.entries(C.FORMATS).filter(([k]) => k !== 'recall' && k !== 'drill').map(([k, f]) =>
        h('a', { class: 'fmt-card', href: '#/play/format/' + k }, h('b', { text: f.name }), h('span', { class: 'fine', text: f.blurb })))));

    // Thinkers to follow
    const th = Object.entries(C.thinkerIndex).filter(([, ids]) => ids.length >= 2 || true).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).slice(0, 24);
    const chips = h('div', { class: 'chip-cloud' });
    const renderChips = () => {
      C.clear(chips);
      th.forEach(([name, ids]) => {
        const on = C.social.isFollowing('thinkers', name);
        chips.append(h('button', { class: 'chip toggle' + (on ? ' on' : ''), type: 'button', 'aria-pressed': String(on), title: ids.length + ' experience(s)', onclick: () => { C.social.toggleFollow('thinkers', name); on || C.engine.signal(C.byId[ids[0]].topic, 'follow'); renderChips(); } }, (on ? '✓ ' : '+ ') + name));
      });
    };
    renderChips();
    root.append(h('h2', { class: 'sec', text: 'Follow thinkers' }), h('p', { class: 'fine', text: 'Followed thinkers and subjects tune your feed and fill the Following tab. Stored on this device only.' }), chips);

    root.append(h('h2', { class: 'sec', text: 'Demo curators' }), h('p', { class: 'fine', text: 'Fictional demo profiles that show how following people and shared collections will work once a backend exists.' }),
      h('div', { class: 'cur-list' }, ...C.CURATORS.map(V.curatorCard)));
    return root;
  };

  V.curatorCard = function (c) {
    const card = h('div', { class: 'cur-card', style: { '--accent': c.color } });
    const render = () => {
      C.clear(card);
      const on = C.social.isFollowing('curators', c.id);
      card.append(h('div', { class: 'avatar', text: c.name[0] }), h('div', { class: 'cur-main' }, h('b', { text: c.name }), h('span', { class: 'fine', text: c.handle + ' · ' + c.focus }), h('span', { class: 'fine', text: c.bio })),
        h('div', { class: 'cur-actions' }, h('a', { class: 'btn ghost small', href: '#/explore/curator/' + c.id }, 'Collection'), h('button', { class: 'btn small ' + (on ? 'ghost' : 'primary'), type: 'button', onclick: () => { C.social.toggleFollow('curators', c.id); render(); } }, on ? 'Following' : 'Follow')));
    };
    render();
    return card;
  };

  V.topicPage = function (id) {
    const t = C.TOPICS.find((x) => x.id === id);
    if (!t) return V.notFound();
    const list = C.library.filter((e) => e.topic === id);
    const m = C.progress.masteryInfo(id), on = () => C.social.isFollowing('topics', id);
    const fbtn = h('button', { class: 'btn small', type: 'button' });
    const sync = () => { fbtn.className = 'btn small ' + (on() ? 'ghost' : 'primary'); fbtn.textContent = on() ? 'Following' : 'Follow'; };
    fbtn.onclick = () => { const was = on(); C.social.toggleFollow('topics', id); !was && C.engine.signal(id, 'follow'); sync(); };
    sync();
    const root = h('div', { class: 'page', style: { '--accent': t.color } },
      V.back('#/explore', 'Explore'),
      h('div', { class: 'topic-hero' }, h('div', { class: 'tile-art big', html: C.art({ id: 'hero-' + id, topic: id }) }), h('h1', { text: t.name }), h('p', { class: 'sub', text: t.blurb }),
        h('div', { class: 'row' }, fbtn, h('a', { class: 'btn primary small', href: '#/play/topic/' + id }, 'Scroll this subject')),
        h('div', { class: 'mastery-line' }, h('span', { class: 'fine', text: 'Mastery: ' + m.name }), V.progressBar(m.pct))),
      h('div', { class: 'list' }, ...list.map(V.listItem)));
    return root;
  };
  V.collectionPage = function (id) {
    const c = C.COLLECTIONS.find((x) => x.id === id);
    if (!c) return V.notFound();
    return h('div', { class: 'page' }, V.back('#/explore', 'Explore'), h('header', { class: 'page-head' }, h('h1', { text: c.title }), h('p', { class: 'sub', text: c.blurb })),
      h('div', { class: 'row' }, h('a', { class: 'btn primary small', href: '#/play/collection/' + id }, 'Scroll through all')),
      h('div', { class: 'list' }, ...c.ids.map((i) => V.listItem(C.byId[i]))));
  };
  V.curatorPage = function (id) {
    const c = C.CURATORS.find((x) => x.id === id);
    if (!c) return V.notFound();
    return h('div', { class: 'page', style: { '--accent': c.color } }, V.back('#/explore', 'Explore'), V.curatorCard(c),
      h('h2', { class: 'sec', text: c.name.split(' ')[0] + '’s picks' }), h('p', { class: 'fine', text: 'Demo content curated by a fictional profile.' }),
      h('div', { class: 'list' }, ...c.picks.map((i) => V.listItem(C.byId[i]))));
  };
  V.notFound = () => V.page('Not found', 'That page does not exist.', h('a', { class: 'btn primary', href: '#/discover' }, 'Back to Discover'));

  /* ---------- Journeys ---------- */
  V.journeys = function () {
    const root = V.page('Journeys', 'Structured paths where each step builds on the last. Finish one to earn a place on your map.');
    C.JOURNEYS.forEach((j) => {
      const t = C.topic(j.topic), jr = S().journeys[j.id] || { done: [] };
      const pct = jr.done.length / j.ids.length;
      root.append(h('a', { class: 'journey-card', href: '#/journey/' + j.id, style: { '--accent': t.color } },
        h('div', { class: 'jc-art', html: C.art({ id: 'j-' + j.id, topic: j.topic }) }),
        h('div', { class: 'jc-body' }, h('span', { class: 'chip topic', text: t.short }), h('h3', { text: j.title }), h('p', { text: j.blurb }),
          h('div', { class: 'jc-meta' }, h('span', { class: 'fine', text: j.ids.length + ' steps · about ' + j.mins + ' min' }), jr.completedAt ? h('span', { class: 'chip done', text: 'Completed' }) : h('span', { class: 'fine', text: jr.done.length + ' / ' + j.ids.length })), V.progressBar(pct))));
    });
    return root;
  };
  V.journeyPage = function (id) {
    const j = C.JOURNEYS.find((x) => x.id === id);
    if (!j) return V.notFound();
    const t = C.topic(j.topic), jr = S().journeys[j.id] || { done: [] };
    const nextIdx = Math.max(0, j.ids.findIndex((i) => !jr.done.includes(i)));
    const allDone = jr.done.length >= j.ids.length;
    return h('div', { class: 'page', style: { '--accent': t.color } }, V.back('#/journeys', 'Journeys'),
      h('div', { class: 'topic-hero' }, h('div', { class: 'tile-art big', html: C.art({ id: 'j-' + j.id, topic: j.topic }) }), h('h1', { text: j.title }), h('p', { class: 'sub', text: j.blurb }),
        h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/journey/' + j.id + '/play/' + (allDone ? 0 : nextIdx) }, allDone ? 'Replay journey' : (jr.done.length ? 'Continue' : 'Begin journey')))),
      h('ol', { class: 'path' }, ...j.ids.map((i, k) => { const e = C.byId[i], dn = jr.done.includes(i); return h('li', { class: dn ? 'done' : (k === nextIdx && !allDone ? 'current' : '') }, h('span', { class: 'node-dot' }, dn ? C.icon('check', 14) : String(k + 1)), h('a', { href: '#/journey/' + j.id + '/play/' + k }, h('b', { text: e.title }), h('span', { class: 'fine', text: C.FORMATS[e.type].name + ' · ' + e.mins + ' min' }))); })));
  };

  /* ---------- Saved ---------- */
  V.saved = function (tab = 'all') {
    const s = S();
    const root = V.page('Saved', 'Your personal library. Private to this device.');
    const tabs = h('div', { class: 'seg', role: 'tablist' }, ...[['all', 'Library'], ['collections', 'Collections'], ['notes', 'Reflections']].map(([k, l]) => h('a', { class: 'seg-btn' + (tab === k ? ' on' : ''), href: '#/saved/' + k, role: 'tab', 'aria-selected': String(tab === k) }, l)));
    root.append(tabs);
    if (tab === 'all') {
      if (!s.saved.length) root.append(empty('Nothing saved yet', 'Tap the bookmark on any card to keep it here.'));
      else root.append(h('div', { class: 'row' }, h('a', { class: 'btn primary small', href: '#/play/saved/all' }, 'Scroll through saved')), h('div', { class: 'list' }, ...s.saved.filter((i) => C.byId[i]).map((i) => h('div', { class: 'list-row' }, V.listItem(C.byId[i]), h('button', { class: 'icon-btn', 'aria-label': 'Remove from library', onclick: (ev) => { C.toggleSave(C.byId[i], true); C.toast('Removed'); C.router.refresh(); } }, C.icon('trash', 18))))));
    } else if (tab === 'collections') {
      const inp = h('input', { class: 'input', placeholder: 'New collection name', maxlength: 40, 'aria-label': 'New collection name' });
      const mk = () => { const n = inp.value.trim(); if (!n) return; C.store.update((st) => { st.collections.push({ id: 'c' + Date.now().toString(36), name: n, items: [], created: Date.now() }); }); C.router.refresh(); };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') mk(); });
      root.append(h('div', { class: 'row new-coll' }, inp, C.tpl.kit.btn('Create', mk)));
      if (!s.collections.length) root.append(empty('No collections yet', 'Group saved ideas by theme: “for my commute,” “argue with friends.”'));
      s.collections.forEach((c) => {
        const items = c.items.filter((i) => C.byId[i]);
        root.append(h('section', { class: 'coll-block' }, h('div', { class: 'row between' }, h('h3', { text: c.name }), h('div', { class: 'row' },
          items.length ? h('a', { class: 'btn ghost small', href: '#/play/saved/' + c.id }, 'Play') : null,
          h('button', { class: 'icon-btn', 'aria-label': 'Rename collection', onclick: () => { const n = prompt('Rename collection', c.name); if (n && n.trim()) { C.store.update(() => { c.name = n.trim().slice(0, 40); }); C.router.refresh(); } } }, C.icon('pen', 18)),
          h('button', { class: 'icon-btn', 'aria-label': 'Delete collection', onclick: () => { if (confirm('Delete this collection? Saved items stay in your library.')) { C.store.update((st) => { st.collections = st.collections.filter((x) => x.id !== c.id); }); C.router.refresh(); } } }, C.icon('trash', 18)))),
          items.length ? h('div', { class: 'list' }, ...items.map((i) => V.listItem(C.byId[i]))) : h('p', { class: 'fine', text: 'Empty. Add ideas with “Add to collection” after saving.' })));
      });
    } else {
      const notes = Object.entries(s.exp).filter(([i, x]) => x.reflection && x.reflection.trim() && C.byId[i]);
      if (!notes.length) root.append(empty('No reflections yet', 'After an experience, write one line about how it changed your thinking. They collect here.'));
      notes.sort((a, b) => (b[1].doneAt || 0) - (a[1].doneAt || 0)).forEach(([i, x]) => root.append(h('article', { class: 'note-card', style: { '--accent': C.topic(C.byId[i].topic).color } }, h('b', { text: C.byId[i].title }), h('p', { text: x.reflection }), h('a', { class: 'fine', href: '#/x/' + i, text: 'Open' }))));
    }
    return root;
    function empty(t, d) { return h('div', { class: 'empty' }, h('h3', { text: t }), h('p', { text: d }), h('a', { class: 'btn primary', href: '#/discover' }, 'Go to Discover')); }
  };

  /* ---------- Daily ---------- */
  V.daily = function () {
    const today = C.dateKey(), picks = C.engine.dailyPicks(today), d = S().daily[today] || { challenge: false, journey: [], complete: false };
    const st = C.progress.streak();
    const mins = picks.journey.reduce((a, e) => a + e.mins, 0);
    const root = V.page('Today', new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
    root.append(h('div', { class: 'streak-banner' }, C.icon('flame', 28), h('div', {}, h('b', { text: st.current + (st.current === 1 ? ' day' : ' days') + ' of learning' }), h('span', { class: 'fine', text: st.today ? 'You have learned today. Everything else is a bonus.' : st.atRisk ? 'A short session today keeps it going. No pressure.' : 'Start a streak with one experience.' }))));
    const ch = picks.challenge, ct = C.topic(ch.topic);
    root.append(h('h2', { class: 'sec', text: 'Daily challenge' }),
      h('a', { class: 'daily-card', href: '#/x/' + ch.id, style: { '--accent': ct.color } }, h('div', { class: 'jc-art', html: C.art(ch) }), h('div', { class: 'jc-body' }, h('span', { class: 'chip topic', text: ct.short + ' · ' + C.FORMATS[ch.type].name }), h('h3', { text: ch.title }), h('p', { text: ch.hook }), d.challenge ? h('span', { class: 'chip done', text: 'Done today' }) : h('span', { class: 'fine', text: 'About ' + ch.mins + ' min' }))));
    const first = Math.max(0, picks.journey.findIndex((e) => !d.journey.includes(e.id)));
    root.append(h('h2', { class: 'sec', text: 'Daily journey' }), h('p', { class: 'fine', text: 'Five short experiences across different subjects and formats. About ' + mins + ' minutes. Optional, and always a little surprising.' }),
      h('ol', { class: 'path' }, ...picks.journey.map((e, k) => { const dn = d.journey.includes(e.id); return h('li', { class: dn ? 'done' : (k === first && !d.complete ? 'current' : '') }, h('span', { class: 'node-dot' }, dn ? C.icon('check', 14) : String(k + 1)), h('a', { href: '#/daily/play/' + k }, h('b', { text: e.title }), h('span', { class: 'fine', text: C.topic(e.topic).short + ' · ' + C.FORMATS[e.type].name + ' · ' + e.mins + ' min' }))); })),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/daily/play/' + (d.complete ? 0 : first) }, d.complete ? 'Play again' : (d.journey.length ? 'Continue today’s journey' : 'Start today’s journey'))));
    const wk = C.progress.week();
    root.append(h('h2', { class: 'sec', text: 'This week' }), h('div', { class: 'week-row' }, ...wk.days.map((dy, i) => h('div', { class: 'wd' + (dy.done ? ' on' : '') + (dy.key === today ? ' today' : '') }, h('span', { text: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i] }), h('i', { text: dy.done ? String(dy.done) : '' })))),
      h('p', { class: 'fine', text: wk.done + ' of ' + wk.goal + ' experiences · ' + wk.topics + ' of ' + wk.topicGoal + ' subjects explored' }));
    return root;
  };
})();
