# Architecture

- **No build.** Classic deferred scripts attach to `window.CUR`. Order is set in `index.html`: util → content → store → social → lib → engine → progress → templates → card → feed → views → app.
- **State**: `C.store` (localStorage key `curiosity.v1`, versioned, merged over defaults, debounced writes).
- **Router**: hash routes in `js/app.js` (`#/discover`, `#/explore/...`, `#/journey/:id`, `#/x/:id`, `#/play/...`).
- **Feed**: `C.Feed` (scroll-snap + IntersectionObserver). Accepts `ids` (finite) or engine-driven endless loading.
- **Engine** (`js/engine.js`): scores candidates on affinity, novelty, connections, difficulty fit, follows, penalties, jitter; reserves an exploration slot; serves due recall cards.
- **Templates** (`js/templates1-3.js`): one renderer per format, sharing `C.tpl.kit`. Add a format by registering a renderer and listing it in `C.FORMATS`.

## Content schema
```js
{ id, type, topic, diff /*1-3*/, mins, title, hook, links:[ids], thinkers:[names],
  takeaway, prompt, /* ...template-specific fields */ }
```

## Social adapter (backend path)
`C.social.adapter` implements:
`sampleDistribution(expId, options)`, `follow(id)`, `unfollow(id)`, `isFollowing(id)`.
`LocalAdapter` returns clearly labelled simulated data. To go live, implement the same methods against a real API (e.g. Supabase/Firebase) and assign it to `C.social.adapter`. UI labels switch off "illustrative" once the adapter reports real data.


## v2 modules
Load order (index.html): content scripts (`atlas-*.js`, `anchors.js`, `holes-*.js`) before `store.js`; `atlas.js`, `mirror.js`, `holes.js`, `holes-sims.js` after `views2.js` and before `app.js`.

- **Atlas** (`js/atlas.js`, `js/content/atlas-*.js`): each table is `{id, topic, title, blurb, mode?, cats?, rows:[[name, clue, value?, cat?, note?]]}`. Question kinds are generated from rows: who, what, true/false (two forms), category, numeric estimate, higher/lower, ordering, odd-one-out. `C.atlas.questions(topic)` gives the count. State: `store.atlas` per table, `store.atlasMeta` totals. Generated `drill:<table>:<seed>` cards are resolved by `C.resolve`.
- **Rabbit Holes** (`js/holes.js`): authored holes in `C.HOLES` (`{id, anchor, topic, title, hook, claim, anti, themes, related, paths:[{id, kind, title, blurb, mins, nodes}]}`); `C.holes.get(id)` returns an authored hole or derives one from any experience. Node renderers live in `H.R`; simulations in `H.sims` (`cave`, `monty`). State: `store.holes[id] = {seen, paths:{pathId: ts}}`.
- **Mirror** (`js/mirror.js`): question kinds in `M.KINDS`; answers are chips plus optional text, appended to `store.mirror.log` (cap 400). Profile uses simple lexical rates (hedges, absolutes, contrasts, causal words) and is presented as description, not grade.
- Validator `scripts/validate-content.js` checks tables (>= 1,000 generated questions per subject), holes (node shapes, ids) and the library. Tests: `tests/e2e.py` (experiences, screens), `tests/e2e_v2.py` (Atlas, holes, Mirror, drills).
