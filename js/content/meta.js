/* Subjects, formats, journeys, collections, demo curators and achievements metadata */
(function () {
  const C = (window.CUR = window.CUR || {});

  C.TOPICS = [
    { id: 'history', name: 'History & Civilisations', short: 'History', color: '#c9a45c', motif: 'arches', blurb: 'How we got here: empires, turning points, and the people inside them.' },
    { id: 'philosophy', name: 'Philosophy & Critical Thinking', short: 'Philosophy', color: '#8aa4e0', motif: 'rings', blurb: 'Paradoxes, arguments and the art of thinking clearly.' },
    { id: 'religion', name: 'World Religions & Theology', short: 'Religion', color: '#c8735f', motif: 'mandala', blurb: 'Traditions of meaning, read fairly and in their own terms.' },
    { id: 'literature', name: 'Literature & Storytelling', short: 'Literature', color: '#d587ab', motif: 'ink', blurb: 'Close readings of great works and how stories shape us.' },
    { id: 'psychology', name: 'Psychology & Behaviour', short: 'Psychology', color: '#7fd1c0', motif: 'ripples', blurb: 'How minds work, and how they trick themselves.' },
    { id: 'science', name: 'Science, Maths & the Universe', short: 'Science', color: '#4fc3d9', motif: 'orbits', blurb: 'Scale, proof, probability and the limits of knowledge.' },
    { id: 'society', name: 'Economics, Politics & Society', short: 'Society', color: '#a9c75e', motif: 'steps', blurb: 'How we organise ourselves, and why institutions look the way they do.' },
    { id: 'arts', name: 'Art, Music & Culture', short: 'Arts', color: '#b890e0', motif: 'strokes', blurb: 'What we make to see, hear and feel more.' },
    { id: 'ethics', name: 'Ethics & Human Nature', short: 'Ethics', color: '#f0975a', motif: 'balance', blurb: 'Right, wrong and the reasons we give.' },
    { id: 'geography', name: 'Geography & Anthropology', short: 'Geography', color: '#6aa56a', motif: 'contours', blurb: 'Maps, places and the variety of human life.' },
    { id: 'thinkers', name: 'Great Thinkers & Inventors', short: 'Thinkers', color: '#e6dcc3', motif: 'constellation', blurb: 'The people behind the ideas, and what they got right and wrong.' },
    { id: 'wisdom', name: 'Practical Wisdom & Communication', short: 'Wisdom', color: '#8ec1f0', motif: 'horizon', blurb: 'Exercises to turn insight into daily practice.' }
  ];

  C.version = '2.0.0';
  C.FORMATS = {
    thought: { name: 'Thought Experiment', verb: 'Decide', blurb: 'A dilemma to choose in, then see how great thinkers would respond.' },
    history: { name: 'Interactive History', verb: 'Decide', blurb: 'Make the call at a turning point, then see what really happened.' },
    challenge: { name: 'Philosophical Challenge', verb: 'Reason', blurb: 'A paradox or proposition: commit, then meet the perspectives.' },
    socratic: { name: 'Socratic Conversation', verb: 'Converse', blurb: 'Answer questions and be guided toward deeper understanding.' },
    perspectives: { name: 'Perspective Shift', verb: 'Compare', blurb: 'One situation seen through many traditions.' },
    explore: { name: 'Interactive Exploration', verb: 'Explore', blurb: 'Timelines, scales, sounds and experiments you can touch.' },
    literature: { name: 'Literature Close Reading', verb: 'Read', blurb: 'Tap into the lines to uncover what great writing is doing.' },
    connections: { name: 'Knowledge Connection', verb: 'Connect', blurb: 'Follow a chain of ideas across centuries and disciplines.' },
    debate: { name: 'Debate & Reasoning', verb: 'Argue', blurb: 'Pick a side, face the strongest objection, then reconsider.' },
    apply: { name: 'Real-Life Application', verb: 'Practise', blurb: 'Turn an idea into an exercise for today.' },
    predict: { name: 'Predict & Reveal', verb: 'Predict', blurb: 'Guess first, then discover how well your intuition did.' },
    spot: { name: 'Spot the Flaw', verb: 'Spot', blurb: 'Rapid-fire reasoning errors to catch.' },
    layers: { name: 'Layered Deep Dive', verb: 'Dig', blurb: 'Make a guess, then peel back layer after layer.' },
    recall: { name: 'Memory Check', verb: 'Recall', blurb: 'A quick retrieval of something you explored earlier.' },
    drill: { name: 'Quickfire Atlas', verb: 'Quickfire', blurb: 'A short run of generated questions from the Atlas.' }
  };

  C.JOURNEYS = [
    { id: 'think-clearly', title: 'Think Before You Believe', topic: 'psychology', mins: 18, blurb: 'Six experiences to sharpen your reasoning: fallacies, hidden assumptions, and how to argue fairly.',
      ids: ['spot-everyday-fallacies', 'wason-lab', 'apply-steelman', 'predict-monty-hall', 'spot-numbers-and-stories', 'layers-dunning-kruger'] },
    { id: 'ancient-minds', title: 'Ancient Minds', topic: 'history', mins: 20, blurb: 'From Athens to the Ganges: the thinkers who first asked how to live, and what we owe each other.',
      ids: ['axial-age-timeline', 'trial-of-socrates', 'euthyphro-dilemma', 'what-is-courage', 'layers-eratosthenes', 'zeno-motion'] },
    { id: 'good-life', title: 'What Is a Good Life?', topic: 'ethics', mins: 20, blurb: 'Pleasure, duty, virtue and community. Test five answers, then try a Stoic practice.',
      ids: ['experience-machine', 'lost-wallet', 'someone-insults-you', 'apply-dichotomy-of-control', 'golden-rule-voices', 'apply-evening-review'] },
    { id: 'how-we-know', title: 'How We Know What We Know', topic: 'science', mins: 20, blurb: 'Evidence, proof, experiment and the limits of each.',
      ids: ['layers-ibn-al-haytham', 'what-is-knowledge', 'powers-of-ten', 'predict-paper-fold', 'layers-godel', 'marys-room'] },
    { id: 'power-and-society', title: 'Power, Rules and Restraint', topic: 'society', mins: 22, blurb: 'How republics fall, how governments are built, and the hard choices of tolerance and fairness.',
      ids: ['crossing-the-rubicon', 'conn-polybius-montesquieu', 'veil-of-ignorance', 'paradox-of-tolerance', 'cuban-missile-crisis', 'predict-compound'] },
    { id: 'words-and-worlds', title: 'Words, Sound and Wonder', topic: 'literature', mins: 20, blurb: 'Poems, music and paintings, and what makes art last.',
      ids: ['lit-ozymandias', 'lit-macbeth-tomorrow', 'lit-dickinson-hope', 'conn-frankenstein', 'sound-of-ratios', 'golden-ratio-myth'] }
  ];

  C.COLLECTIONS = [
    { id: 'mind-benders', title: 'Ten-Minute Mind Benders', blurb: 'Paradoxes and puzzles that break intuition.', ids: ['liars-paradox', 'zeno-motion', 'predict-monty-hall', 'predict-birthday', 'ship-of-theseus', 'marys-room'] },
    { id: 'myths-corrected', title: 'Myths Worth Correcting', blurb: 'Popular stories that deserve a closer look.', ids: ['golden-ratio-myth', 'layers-dunning-kruger', 'layers-eratosthenes', 'mercator-distortion', 'layers-weird-psychology'] },
    { id: 'try-today', title: 'Try This Today', blurb: 'Ideas turned into exercises for your own life.', ids: ['apply-premortem', 'apply-steelman', 'apply-dichotomy-of-control', 'apply-evening-review', 'someone-insults-you'] },
    { id: 'poetry-prose', title: 'Poetry & Prose Close-Ups', blurb: 'Short, powerful passages from public-domain classics.', ids: ['lit-ozymandias', 'lit-macbeth-tomorrow', 'lit-dickinson-hope', 'conn-frankenstein'] },
    { id: 'hard-questions', title: 'Questions Without Easy Answers', blurb: 'Where thoughtful people still disagree.', ids: ['debate-free-will', 'debate-problem-of-evil', 'debate-lying', 'debate-presentism', 'paradox-of-tolerance', 'euthyphro-dilemma'] },
    { id: 'turning-points', title: 'Turning Points', blurb: 'Decisions that changed history, and ones that nearly did.', ids: ['crossing-the-rubicon', 'cuban-missile-crisis', 'ragusa-quarantine', 'trial-of-socrates'] }
  ];

  /* Fictional demo curators. They show how follows, profiles and shared collections will work once a backend exists. */
  C.CURATORS = [
    { id: 'mara', name: 'Mara Okonkwo', handle: '@mara', focus: 'Ancient worlds', bio: 'Demo profile (fictional). Collects stories of how old ideas travelled.', color: '#c9a45c', picks: ['axial-age-timeline', 'trial-of-socrates', 'layers-eratosthenes', 'ragusa-quarantine', 'conn-polybius-montesquieu'] },
    { id: 'theo', name: 'Theo Lindqvist', handle: '@theo', focus: 'Mind & method', bio: 'Demo profile (fictional). Interested in how we can reason better.', color: '#7fd1c0', picks: ['wason-lab', 'spot-numbers-and-stories', 'predict-monty-hall', 'apply-steelman', 'layers-dunning-kruger'] },
    { id: 'priya', name: 'Priya Raman', handle: '@priya', focus: 'Big questions', bio: 'Demo profile (fictional). Fascinated by questions that survive every answer.', color: '#8aa4e0', picks: ['marys-room', 'debate-free-will', 'euthyphro-dilemma', 'layers-godel', 'liars-paradox'] }
  ];

  C.ACHIEVEMENTS = [
    { id: 'first-spark', name: 'First Spark', desc: 'Complete your first experience.', icon: 'spark' },
    { id: 'three-days', name: 'Three in a Row', desc: 'Learn on 3 days in a row.', icon: 'flame' },
    { id: 'week-streak', name: 'A Week of Wonder', desc: 'Learn on 7 days in a row.', icon: 'flame' },
    { id: 'polymath', name: 'Polymath', desc: 'Complete experiences in 6 different subjects.', icon: 'grid' },
    { id: 'renaissance', name: 'Renaissance Mind', desc: 'Complete experiences in all 12 subjects.', icon: 'grid' },
    { id: 'contrarian', name: 'Changed My Mind', desc: 'Revise your view after hearing the other side.', icon: 'swap' },
    { id: 'both-sides', name: 'Both Sides Now', desc: 'Complete 3 debates.', icon: 'scale' },
    { id: 'reflective', name: 'Reflective', desc: 'Write 5 reflections.', icon: 'pen' },
    { id: 'journal', name: 'The Examined Life', desc: 'Write 20 reflections.', icon: 'pen' },
    { id: 'falsifier', name: 'Falsifier', desc: 'Complete the hidden-rule experiment.', icon: 'flask' },
    { id: 'steelmanner', name: 'Steelmanner', desc: 'Complete the steelman exercise.', icon: 'scale' },
    { id: 'journeyman', name: 'Journeyman', desc: 'Complete a learning journey.', icon: 'route' },
    { id: 'wayfarer', name: 'Wayfarer', desc: 'Complete 3 learning journeys.', icon: 'route' },
    { id: 'daily-ritual', name: 'Daily Ritual', desc: 'Complete 3 daily journeys.', icon: 'sun' },
    { id: 'long-memory', name: 'Long Memory', desc: 'Answer 10 memory checks correctly.', icon: 'brain' },
    { id: 'full-spectrum', name: 'Full Spectrum', desc: 'Try every one of the 13 formats.', icon: 'grid' },
    { id: 'cartographer', name: 'Cartographer', desc: 'Light up 8 connections on your knowledge map.', icon: 'map' },
    { id: 'sharer', name: 'Pass It On', desc: 'Share a discovery.', icon: 'share' },
    { id: 'first-hole', name: 'Down the Hole', desc: 'Finish your first Rabbit Hole path.', icon: 'hole' },
    { id: 'deep-diver', name: 'Deep Diver', desc: 'Fully explore every path of one Rabbit Hole.', icon: 'hole' },
    { id: 'hole-wanderer', name: 'Hole Wanderer', desc: 'Finish 25 Rabbit Hole paths.', icon: 'hole' },
    { id: 'mirror-gazer', name: 'Mirror Gazer', desc: 'Answer 10 Mirror questions.', icon: 'mirror' },
    { id: 'mirror-keeper', name: 'Self-Examiner', desc: 'Answer 50 Mirror questions.', icon: 'mirror' },
    { id: 'atlas-first', name: 'Atlas Opened', desc: 'Finish your first Atlas session.', icon: 'atlas' },
    { id: 'atlas-500', name: 'Five Hundred Answers', desc: 'Answer 500 Atlas questions.', icon: 'atlas' },
    { id: 'atlas-all', name: 'Whole Atlas', desc: 'Finish an Atlas session in every subject.', icon: 'atlas' }
  ];

  C.LEVELS = [
    { name: 'Wanderer', xp: 0 }, { name: 'Inquirer', xp: 80 }, { name: 'Seeker', xp: 220 }, { name: 'Thinker', xp: 450 },
    { name: 'Scholar', xp: 800 }, { name: 'Polymath', xp: 1300 }, { name: 'Sage', xp: 2000 }
  ];
  C.MASTERY = ['Unexplored', 'Curious', 'Familiar', 'Fluent', 'Adept', 'Scholar'];
  C.MASTERY_XP = [0, 12, 40, 80, 130, 200];
})();
