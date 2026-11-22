#!/usr/bin/env node
/* Validates the content library so that adding thousands of experiences stays safe.
   Usage: node scripts/validate-content.js   (exits non-zero on any error) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

globalThis.window = globalThis;
const root = path.join(__dirname, '..');
['js/content/meta.js', 'js/content/thought.js', 'js/content/reasoning.js', 'js/content/explore.js', 'js/content/practice.js', ...fs.readdirSync(path.join(__dirname, '..', 'js/content')).filter((f) => /^(atlas-|holes-|anchors)/.test(f)).sort().map((f) => 'js/content/' + f)].forEach((f) => {
  vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f });
});
const C = globalThis.CUR;
const errors = [], warns = [];
const err = (id, m) => errors.push(`[${id}] ${m}`);
const warn = (id, m) => warns.push(`[${id}] ${m}`);
const topicIds = new Set(C.TOPICS.map((t) => t.id));
const ids = new Set();
const str = (e, k, min = 1) => { if (typeof e[k] !== 'string' || e[k].trim().length < min) err(e.id, `missing/short string "${k}"`); };
const arr = (e, k, min = 1) => { if (!Array.isArray(e[k]) || e[k].length < min) err(e.id, `"${k}" must be an array with at least ${min} item(s)`); };

const SHAPE = {
  thought: (e) => { str(e, 'scenario'); arr(e, 'choices', 2); (e.choices || []).forEach((c) => { ['id', 'label', 'result', 'lens'].forEach((k) => str(c, k)); }); arr(e, 'lenses', 1); },
  history: (e) => { str(e, 'date'); str(e, 'role'); arr(e, 'facts', 2); arr(e, 'options', 2); str(e, 'outcome'); str(e, 'why'); if (!(e.options || []).some((o) => o.id === e.actual)) err(e.id, '"actual" must match an option id'); (e.options || []).forEach((o) => { ['id', 'label', 'think'].forEach((k) => str(o, k)); }); },
  challenge: (e) => { str(e, 'claim'); arr(e, 'stances', 2); arr(e, 'perspectives', 2); str(e, 'verdict'); },
  socratic: (e) => { str(e, 'intro'); arr(e, 'steps', 2); str(e, 'conclusion'); (e.steps || []).forEach((s, i) => { str(s, 'q'); if (!Array.isArray(s.choices) || s.choices.length < 2) err(e.id, `step ${i} needs 2+ choices`); (s.choices || []).forEach((c) => { str(c, 'label'); str(c, 'reply'); }); }); },
  perspectives: (e) => { str(e, 'situation'); arr(e, 'lenses', 3); str(e, 'closing'); (e.lenses || []).forEach((l) => { ['who', 'tag', 'text'].forEach((k) => str(l, k)); }); },
  explore: (e) => {
    if (!['timeline', 'scale', 'mercator', 'intervals', 'wason'].includes(e.kind)) err(e.id, 'unknown explore kind ' + e.kind);
    str(e, 'intro'); str(e, 'reveal');
    if (e.kind === 'timeline') { arr(e, 'events', 3); if (!e.range || e.range.length !== 2) err(e.id, 'range'); }
    if (e.kind === 'scale') { arr(e, 'points', 5); }
    if (e.kind === 'mercator') str(e, 'facts');
  },
  literature: (e) => {
    arr(e, 'lines', 3); str(e, 'author'); str(e, 'context'); str(e, 'lifeQ');
    const text = (e.lines || []).join('\n'); const n = (text.match(/\[\[.+?::.+?\]\]/g) || []).length;
    if (n < 3) err(e.id, 'needs at least 3 annotated phrases ([[phrase::note]])');
    if ((text.match(/\[\[/g) || []).length !== n) err(e.id, 'malformed annotation marker');
  },
  connections: (e) => { arr(e, 'chain', 3); arr(e, 'bridges', 2); str(e, 'reveal'); (e.bridges || []).forEach((b, i) => { str(b, 'q'); str(b, 'explain'); if (!Array.isArray(b.options) || b.options.length < 2) err(e.id, `bridge ${i} options`); else if (!(b.correct >= 0 && b.correct < b.options.length)) err(e.id, `bridge ${i} correct index`); }); },
  debate: (e) => { str(e, 'question'); if (!Array.isArray(e.sides) || e.sides.length !== 2) err(e.id, 'debate needs exactly 2 sides'); (e.sides || []).forEach((s) => { str(s, 'id'); str(s, 'label'); arr(s, 'case', 2); str(s, 'objection'); }); str(e, 'closing'); },
  apply: (e) => { if (!['write', 'sort'].includes(e.kind)) err(e.id, 'apply kind'); str(e, 'intro'); str(e, 'closing'); if (e.kind === 'write') arr(e, 'prompts', 2); else { arr(e, 'items', 3); arr(e, 'buckets', 2); (e.items || []).forEach((i) => { if (!(e.buckets || []).some((b) => b.id === i.a)) err(e.id, 'sort item answer not in buckets'); }); } },
  predict: (e) => { str(e, 'q'); str(e, 'explain'); if (e.mode === 'choice') { arr(e, 'options', 2); if (!(e.truthIndex >= 0 && e.truthIndex < (e.options || []).length)) err(e.id, 'truthIndex'); } else { ['min', 'max', 'truth'].forEach((k) => { if (typeof e[k] !== 'number') err(e.id, 'numeric ' + k); }); if (e.truth < e.min || e.truth > e.max) err(e.id, 'truth outside slider range'); } },
  spot: (e) => { str(e, 'intro'); arr(e, 'items', 3); (e.items || []).forEach((i) => { str(i, 'arg'); str(i, 'explain'); if (!(i.correct >= 0 && i.correct < i.options.length)) err(e.id, 'spot correct index'); }); },
  layers: (e) => { if (!e.guess || !Array.isArray(e.guess.options) || !(e.guess.answer >= 0 && e.guess.answer < e.guess.options.length)) err(e.id, 'guess'); arr(e, 'layers', 3); (e.layers || []).forEach((l) => { str(l, 'h'); str(l, 't'); }); }
};

C.library.forEach((e) => {
  if (!e.id || !/^[a-z0-9-]+$/.test(e.id)) err(e.id || '?', 'id must be kebab-case');
  if (ids.has(e.id)) err(e.id, 'duplicate id'); ids.add(e.id);
  if (!topicIds.has(e.topic)) err(e.id, 'unknown topic ' + e.topic);
  if (!C.FORMATS[e.type] || e.type === 'recall' || e.type === 'drill') err(e.id, 'unknown type ' + e.type);
  if (![1, 2, 3].includes(e.diff)) err(e.id, 'diff must be 1-3');
  if (!(e.mins >= 1 && e.mins <= 10)) err(e.id, 'mins must be 1-10');
  ['title', 'hook', 'takeaway', 'prompt'].forEach((k) => str(e, k, 8));
  if (e.takeaway && e.takeaway.length > 190) warn(e.id, 'takeaway is long (' + e.takeaway.length + '); it is used in memory checks');
  if (e.hook && e.hook.length > 150) warn(e.id, 'hook is long');
  (e.links || []).forEach((t) => { if (!topicIds.has(t)) err(e.id, 'link to unknown topic ' + t); });
  if (SHAPE[e.type]) SHAPE[e.type](e);
});
const known = new Set(ids);
const refs = (label, list, get) => list.forEach((x) => get(x).forEach((i) => { if (!known.has(i)) err(label + ':' + (x.id || '?'), 'unknown experience id ' + i); }));
refs('journey', C.JOURNEYS, (j) => j.ids); refs('collection', C.COLLECTIONS, (c) => c.ids); refs('curator', C.CURATORS, (c) => c.picks);
C.JOURNEYS.forEach((j) => { if (!topicIds.has(j.topic)) err(j.id, 'journey topic'); });
const perTopic = {}, perType = {};
C.library.forEach((e) => { perTopic[e.topic] = (perTopic[e.topic] || 0) + 1; perType[e.type] = (perType[e.type] || 0) + 1; });
C.TOPICS.forEach((t) => { if (!perTopic[t.id]) err(t.id, 'subject has no experiences'); });
Object.keys(C.FORMATS).filter((k) => k !== 'recall' && k !== 'drill').forEach((k) => { if (!perType[k]) err(k, 'format has no sample experience'); });

console.log(`Experiences: ${C.library.length} | subjects: ${C.TOPICS.length} | formats with samples: ${Object.keys(perType).length}`);
console.log('By subject:', JSON.stringify(perTopic));
console.log('By format :', JSON.stringify(perType));

/* ---------- Atlas fact tables ---------- */
const MIN_PER_SUBJECT = 1000;
const atlasPer = {}, tids = new Set();
(C.ATLAS || []).forEach((t) => {
  if (tids.has(t.id)) err(t.id, 'duplicate table id'); tids.add(t.id);
  if (!topicIds.has(t.topic)) err(t.id, 'unknown topic ' + t.topic);
  str(t, 'title'); str(t, 'blurb');
  if (t.mode && !['year', 'num'].includes(t.mode)) err(t.id, 'bad mode');
  if (!Array.isArray(t.rows) || t.rows.length < 12) { err(t.id, 'needs at least 12 rows'); return; }
  const k = 4 + (t.cats && Object.keys(t.cats).length >= 3 ? 1 : 0) + (t.mode ? 2 : 0);
  const n = t.rows.length, q = n * k + (t.mode ? Math.floor(n / 4) : 0) + (t.odd ? Math.floor(n / 3) : 0);
  const a = (atlasPer[t.topic] = atlasPer[t.topic] || { facts: 0, questions: 0 }); a.facts += n; a.questions += q;
  const names = new Set(), clues = new Set();
  t.rows.forEach((r) => {
    if (!Array.isArray(r) || typeof r[0] !== 'string' || typeof r[1] !== 'string') { err(t.id, 'malformed row'); return; }
    if (names.has(r[0])) err(t.id, 'duplicate name ' + r[0]); names.add(r[0]);
    if (clues.has(r[1])) err(t.id, 'duplicate clue ' + r[0]); clues.add(r[1]);
    if (r[0].length > 3 && r[1].toLowerCase().includes(r[0].toLowerCase())) err(t.id, 'clue gives away its answer: ' + r[0]);
    if (t.mode && typeof r[2] !== 'number') err(t.id, 'row needs a numeric value: ' + r[0]);
    if (t.cats && r[3] !== undefined && !t.cats[r[3]]) err(t.id, 'unknown category ' + r[3] + ' on ' + r[0]);
  });
});
C.TOPICS.forEach((t) => { const a = atlasPer[t.id]; if (!a || a.questions < MIN_PER_SUBJECT) err(t.id, `Atlas has ${a ? a.questions : 0} questions; need at least ${MIN_PER_SUBJECT}`); });
console.log('Atlas by subject (facts / generated questions):'); C.TOPICS.forEach((t) => { const a = atlasPer[t.id] || { facts: 0, questions: 0 }; console.log(`  ${t.id.padEnd(11)} ${String(a.facts).padStart(4)} / ${a.questions}`); });

/* ---------- Rabbit Holes ---------- */
const NODE_REQ = { read: ['p'], choice: ['q', 'opts'], compare: ['cols'], ladder: ['claim', 'rungs'], sort: ['q', 'buckets', 'items'], scale: ['q', 'left', 'right'], reveal: ['p'], link: ['items'], fig: ['svg'], mirror: [], sim: ['id'] };
const SIMS = new Set(['cave', 'monty']);
const holeIds = new Set((C.HOLES || []).map((x) => x.id)), pathKeys = new Set();
const expIds = new Set(C.library.map((e) => e.id));
(C.HOLES || []).forEach((hl) => {
  const id = 'hole:' + hl.id;
  ['id', 'topic', 'title', 'hook', 'claim', 'anti'].forEach((k) => str(hl, k));
  if (!topicIds.has(hl.topic)) err(id, 'unknown topic');
  if (hl.anchor && !expIds.has(hl.anchor)) err(id, 'unknown anchor ' + hl.anchor);
  (hl.related || []).forEach((r) => { if (!holeIds.has(r)) err(id, 'related hole does not exist: ' + r); });
  arr(hl, 'paths', 4); arr(hl, 'themes', 1);
  (hl.paths || []).forEach((p) => {
    const pid = id + '/' + p.id; if (pathKeys.has(pid)) err(pid, 'duplicate path id'); pathKeys.add(pid);
    ['id', 'kind', 'title', 'blurb'].forEach((k) => str(p, k)); arr(p, 'nodes', 2);
    (p.nodes || []).forEach((n, i) => {
      const req = NODE_REQ[n.t]; if (!req) { err(pid, `node ${i}: unknown type ${n.t}`); return; }
      req.forEach((k) => { if (n[k] === undefined) err(pid, `node ${i} (${n.t}) missing ${k}`); });
      if (n.t === 'choice') { if (n.ans !== undefined && !(n.ans >= 0 && n.ans < n.opts.length)) err(pid, `node ${i}: ans out of range`); n.opts.forEach((o) => { if (!Array.isArray(o) || o.length < 2) err(pid, `node ${i}: option needs [label, response]`); }); }
      if (n.t === 'sort') n.items.forEach((it) => { if (!(it.b >= 0 && it.b < n.buckets.length)) err(pid, `node ${i}: bad bucket`); });
      if (n.t === 'compare' && (!n.cols || n.cols.length !== 2)) err(pid, `node ${i}: compare needs exactly 2 columns`);
      if (n.t === 'sim' && !SIMS.has(n.id)) err(pid, `node ${i}: unknown sim ${n.id}`);
    });
    if (!(p.nodes || []).some((n) => n.t === 'mirror')) warn(pid, 'path has no Mirror step');
  });
});
console.log(`Rabbit Holes: ${(C.HOLES || []).length} authored (${pathKeys.size} paths) + ${C.library.length} derived from experiences`);
warns.forEach((w) => console.warn('warn ' + w));
if (errors.length) { errors.forEach((x) => console.error('ERROR ' + x)); console.error(`\n${errors.length} error(s)`); process.exit(1); }
console.log('Content OK');
