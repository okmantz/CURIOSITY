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
