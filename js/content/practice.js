/* Real-Life Applications, Predictions, Fallacy Spotters, Layered Deep Dives */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.library = C.library || [];

  /* ---------- Real-Life Applications ---------- */
  C.library.push(
    {
      id: 'apply-premortem', type: 'apply', kind: 'write', topic: 'wisdom', diff: 1, mins: 3,
      title: 'Imagine It Has Already Failed',
      hook: 'A decision-making trick used by project managers: assume your plan failed, then explain why.',
      links: ['psychology', 'society'], thinkers: ['Gary Klein'],
      intro: 'In the “premortem” (Gary Klein, Harvard Business Review, 2007), you imagine a plan has already failed. Research on “prospective hindsight” suggests this helps people generate more specific reasons for failure than simply asking what could go wrong.',
      prompts: [
        { q: 'Pick something you plan to do in the next month. In one sentence, what is it?', ph: 'e.g., launch my side project, have a hard conversation, run a 10K' },
        { q: 'It is a year later and it failed completely. Write the most likely reasons, in specific detail.', ph: 'Be vivid. What went wrong, step by step?' },
        { q: 'Which one reason could you reduce this week? What is the first step?', ph: 'One concrete, small action' }
      ],
      closing: 'The trick is psychological: permission to imagine failure frees people to voice worries that optimism suppresses.',
      takeaway: 'Imagining failure in advance reveals risks that optimism hides, and gives you time to act on them.',
      prompt: 'What was the reason you wrote that surprised you most?'
    },
    {
      id: 'apply-steelman', type: 'apply', kind: 'write', topic: 'wisdom', diff: 2, mins: 4,
      title: 'Argue the Other Side Better Than They Do',
      hook: 'Before you criticise a view you dislike, a famous rule says you must restate it so well its owner would thank you.',
      links: ['philosophy', 'society', 'psychology'], thinkers: ['Anatol Rapoport', 'Daniel Dennett'],
      intro: 'Philosopher Daniel Dennett (Intuition Pumps, 2013) popularised a set of rules from the game theorist Anatol Rapoport. First: restate the other position so clearly that they say, “I wish I’d put it that way.” Then list points of agreement and anything you learned. Only then may you criticise.',
      prompts: [
        { q: 'Name a view you disagree with, one you have met in real life, not a caricature.', ph: 'Something specific, e.g., a policy, a belief, a way of living' },
        { q: 'Restate it in its strongest form, as its most thoughtful defender would.', ph: 'Write 2–3 sentences. No sarcasm, no “they think that…”' },
        { q: 'What do you now agree with, or what did you learn?', ph: 'Even a small point counts' },
        { q: 'What do you still disagree with, specifically?', ph: 'Now your criticism is aimed at the real argument' }
      ],
      closing: 'The goal is not to be persuaded. It is to make sure that when you disagree, you disagree with the real thing.',
      takeaway: 'You cannot honestly reject an argument until you can state it so that its defenders recognise it.',
      prompt: 'Did restating their view change how you feel about the person who holds it?'
    },
    {
      id: 'apply-dichotomy-of-control', type: 'apply', kind: 'sort', topic: 'wisdom', diff: 1, mins: 3,
      title: 'What Is Actually Up to You?',
      hook: 'The Stoic habit of sorting worries into what you control and what you do not.',
      links: ['philosophy', 'psychology', 'ethics'], thinkers: ['Epictetus', 'William Irvine'],
      intro: 'Epictetus opened his Handbook with a distinction: some things are up to us (our judgements, intentions, effort), others are not (our reputation, the weather, other people’s actions). Sort each item. Modern writers such as William Irvine add a middle category: things that are partly up to you.',
      buckets: [{ id: 'mine', label: 'Up to me' }, { id: 'partly', label: 'Partly up to me' }, { id: 'not', label: 'Not up to me' }],
      items: [
        { t: 'How much effort I put into the presentation', a: 'mine', why: 'Your effort and preparation are yours.' },
        { t: 'Whether my manager notices my work', a: 'partly', why: 'You control how visible you make it, not their attention.' },
        { t: 'The weather on my trip', a: 'not', why: 'You can pack well, but not change the sky.' },
        { t: 'Whether I get the job after the interview', a: 'partly', why: 'You can prepare and present well. The decision is theirs.' },
        { t: 'How I interpret a rude comment', a: 'mine', why: 'The words are theirs. Your interpretation is yours.' },
        { t: 'What strangers think of me', a: 'not', why: 'You can behave well, but cannot control their thoughts.' }
      ],
      closing: 'The aim is not to stop caring about outcomes, but to put your effort where it counts. A common variant: pursue goals fully, while accepting the result as not entirely yours.',
      takeaway: 'Put your energy into what you can influence, and treat the rest as weather.',
      prompt: 'What are you worried about right now? Where does it fall on the three-way sort?'
    },
    {
      id: 'apply-evening-review', type: 'apply', kind: 'write', topic: 'wisdom', diff: 1, mins: 3,
      title: 'The Three-Minute Night Review',
      hook: 'A Roman philosopher ended each day by asking himself three questions. Try them tonight.',
      links: ['philosophy', 'psychology', 'ethics'], thinkers: ['Seneca', 'Sextius'],
      intro: 'In On Anger, Seneca describes the habit of a teacher, Sextius: each night he asked what ailment he had cured, what fault he had resisted, and in what respect he was better. Seneca says he did something similar, examining the whole day, and found that his sleep was calmer.',
      prompts: [
        { q: 'What went well today because of something you chose?', ph: 'A small win counts' },
        { q: 'Where did you act against your own values or lose your temper?', ph: 'Describe it honestly, without self-attack' },
        { q: 'What will you do differently tomorrow?', ph: 'One specific adjustment' }
      ],
      closing: 'Notice that the exercise is a review, not a trial. Seneca writes that he hides nothing from himself, and forgives himself. The point is learning, not punishment.',
      takeaway: 'A brief, honest review each day turns experience into learning.',
      prompt: 'How might a nightly review change how you act during the day, knowing it is coming?'
    }
  );

  /* ---------- Predictions ---------- */
  C.library.push(
    {
      id: 'predict-paper-fold', type: 'predict', mode: 'slider', topic: 'science', diff: 1, mins: 2,
      title: 'Fold It Until It Reaches the Moon',
      hook: 'Take a sheet of paper. Fold it in half. And again. How many folds to reach the Moon?',
      links: ['geography', 'society'], thinkers: ['Britney Gallivan'],
      q: 'Paper is about 0.1 mm thick. If you could keep folding it in half (ignoring physical limits), how many folds would it take for the stack to be thicker than the distance to the Moon (about 384,000 km)?',
      min: 1, max: 100, step: 1, unit: 'folds', truth: 42, tolerance: 8,
      explain: 'Each fold doubles the thickness: after n folds it is 0.1 mm × 2ⁿ. After 42 folds that is about 440,000 km, further than the Moon. After 41, it falls short. In practice, a student named Britney Gallivan folded a very long roll of paper twelve times in 2002, and worked out the formula for the limit.',
      takeaway: 'Exponential growth is unintuitive: tiny repeated doubling quickly produces astronomical numbers.',
      prompt: 'Where else does doubling sneak up on us: in money, in disease, in technology?'
    },
    {
      id: 'predict-birthday', type: 'predict', mode: 'slider', topic: 'science', diff: 2, mins: 2,
      title: 'The Birthday Coincidence',
      hook: 'How many people must be in a room before two probably share a birthday?',
      links: ['psychology', 'society'], thinkers: [],
      q: 'How many people must be in a room for it to be more likely than not that at least two share a birthday? (Assume 365 equally likely birthdays.)',
      min: 2, max: 100, step: 1, unit: 'people', truth: 23, tolerance: 6,
      explain: 'Only 23. The reason is that you are not comparing one person to the others, but every pair: 23 people form 253 pairs, which gives about a 50.7% chance of a match. At 57 people, it is about 99%. Real birthdays are not perfectly uniform, but the result barely changes.',
      takeaway: 'Our intuition for coincidences ignores the sheer number of pairs, so surprising matches are far more common than they feel.',
      prompt: 'What “amazing coincidence” in your life might be less surprising than it seemed?'
    },
    {
      id: 'predict-monty-hall', type: 'predict', mode: 'choice', topic: 'science', diff: 2, mins: 3,
      title: 'Three Doors and a Goat',
      hook: 'A famous puzzle that made professional mathematicians write angry letters.',
      links: ['psychology', 'philosophy'], thinkers: ['Marilyn vos Savant'],
      q: 'You pick Door 1 of three; one hides a car, two hide goats. The host, who knows what is behind each door, opens Door 3 to reveal a goat and offers you the chance to switch to Door 2. What is the probability you win if you switch?',
      options: ['1/3', '1/2', '2/3'], truthIndex: 2, sim: true,
      explain: 'The answer is 2/3. Your first pick is right only 1/3 of the time, and that does not change. Since the host always reveals a goat, the other 2/3 of the probability now sits on the remaining door. When Marilyn vos Savant published this solution in 1990, thousands of readers, many with PhDs, wrote to say she was wrong. Try the simulator below.',
      takeaway: 'New information changes probabilities only if you reason about how it was produced. The host’s knowledge matters.',
      prompt: 'Where might you be ignoring how information was selected for you?'
    },
    {
      id: 'predict-compound', type: 'predict', mode: 'slider', topic: 'society', diff: 2, mins: 2, log: true,
      title: 'One Dollar, Seventy Years',
      hook: 'A single dollar grows at 7% a year. What is it worth when you are old?',
      links: ['science', 'ethics'], thinkers: [],
      q: 'You invest $1 at a steady 7% annual return and leave it alone for 70 years (ignoring inflation and taxes). Roughly how many dollars will you have?',
      min: 1, max: 10000, step: 1, unit: 'dollars', truth: 114, tolerance: 0.35,
      explain: 'About $114. A handy rule: money at 7% doubles roughly every 10 years (the “rule of 72”: 72 ÷ 7 ≈ 10.3). Seventy years is almost seven doublings, and 2⁷ is about 128. Real returns vary year to year, and inflation reduces buying power. This is a lesson in arithmetic, not financial advice.',
      takeaway: 'Compounding is slow, then sudden. Time often matters more than the amount.',
      prompt: 'What good habit, repeated slightly each day, would compound into something large?'
    }
  );

  /* ---------- Fallacy Spotters ---------- */
  const FALL = ['Ad hominem', 'Straw man', 'False dilemma', 'Slippery slope'];
  const STAT = ['Post hoc fallacy', 'Survivorship bias', 'Cherry-picking', 'Base-rate neglect'];
  C.library.push(
    {
      id: 'spot-everyday-fallacies', type: 'spot', topic: 'psychology', diff: 1, mins: 2,
      title: 'Name That Fallacy: Everyday Edition',
      hook: 'Four arguments you have probably heard this week. Each has a flaw.',
      links: ['philosophy', 'society', 'wisdom'], thinkers: ['Aristotle'],
      intro: 'A fallacy is a pattern of reasoning that looks convincing but does not hold up. Identify each.',
      items: [
        { arg: '“Dr. Lee says we should cut sugar in school lunches, but she is overweight herself. Why listen to her?”', options: FALL, correct: 0, explain: 'Ad hominem: it attacks the person, not the argument. Whether sugar is harmful does not depend on the speaker’s weight.' },
        { arg: '“Either you support this bill in full or you do not care about public safety.”', options: FALL, correct: 2, explain: 'False dilemma: it offers two options when many exist. You could support its goals but oppose parts of the bill.' },
        { arg: 'A: “We should require more recycling.” B: “So you want the government to control everything we throw away?”', options: FALL, correct: 1, explain: 'Straw man: B replaces A’s position with an exaggerated version that is easier to attack.' },
        { arg: '“If we let students retake one test, soon they will expect to retake every test, and then grades will mean nothing.”', options: FALL, correct: 3, explain: 'Slippery slope: it assumes one step inevitably leads to an extreme outcome without showing why. Slopes can be real, but the argument must show each link.' }
      ],
      takeaway: 'Naming a flaw makes it easier to see, and harder to be fooled by, in daily arguments.',
      prompt: 'Which of these do you hear most often, from others or from yourself?'
    },
    {
      id: 'spot-numbers-and-stories', type: 'spot', topic: 'psychology', diff: 2, mins: 3,
      title: 'Name That Fallacy: Numbers and Stories',
      hook: 'Subtle reasoning errors that fool experts. One of them helped win a war.',
      links: ['science', 'history', 'society'], thinkers: ['Abraham Wald'],
      intro: 'These errors hide in statistics and stories. Identify each.',
      items: [
        { arg: '“Every time I wash my car, it rains the next day. Washing my car causes rain.”', options: STAT, correct: 0, explain: 'Post hoc (“after this, therefore because of this”): one event following another does not mean it caused it.' },
        { arg: 'In World War II, analysts noted that returning bombers had bullet holes mostly on the wings and tail, and proposed adding armour to those areas.', options: STAT, correct: 1, explain: 'Survivorship bias. The statistician Abraham Wald pointed out that planes hit in other places, such as the engines, did not return. The armour belonged where the survivors had no holes.' },
        { arg: 'A supplement company cites three studies showing a benefit, and does not mention twelve studies that found none.', options: STAT, correct: 2, explain: 'Cherry-picking: selecting only the evidence that supports a conclusion and ignoring the rest.' },
        { arg: '“The test for a rare disease (1 in 10,000 people) is 99% accurate, and I tested positive, so I almost certainly have it.”', options: STAT, correct: 3, explain: 'Base-rate neglect. In 10,000 people, about 1 has the disease, but about 100 healthy people also test positive (1% false positives). So a positive result means roughly a 1% chance, not 99%.' }
      ],
      takeaway: 'To judge evidence, ask what you are not seeing: the missing cases, the ignored studies, the base rate.',
      prompt: 'What evidence in your own life might be filtered before it reaches you?'
    }
  );

  /* ---------- Layered Deep Dives ---------- */
  C.library.push(
    {
      id: 'layers-dunning-kruger', type: 'layers', topic: 'psychology', diff: 2, mins: 3,
      title: 'What the Dunning–Kruger Effect Really Shows',
      hook: 'The most-shared psychology idea of the internet age is more complicated than the meme.',
      links: ['science', 'wisdom', 'philosophy'], thinkers: ['David Dunning', 'Justin Kruger'],
      guess: { q: 'In the original 1999 study, how did the lowest-scoring participants rate their own performance?', options: ['Accurately', 'Far above their actual level', 'Far below their actual level'], answer: 1 },
      layers: [
        { h: 'The popular version', t: '“Incompetent people are too incompetent to know they are incompetent.” It is catchy, easily shared, and used to dismiss other people.' },
        { h: 'What the study found', t: 'Kruger and Dunning (1999) tested people on logic, grammar and humour. The bottom quartile estimated their performance around the 60th percentile while actually scoring near the 12th. The top performers slightly underestimated themselves.' },
        { h: 'The critics', t: 'Later researchers argued that much of the pattern appears even with random data, due to statistical artefacts such as regression to the mean and a general better-than-average tendency. Defenders respond that weaker performers really do have less insight into their performance. The size and cause remain debated.' },
        { h: 'The useful lesson', t: 'Everyone is poor at judging their own skill in unfamiliar areas. The practical move is not to spot who is overconfident, but to seek feedback that could prove you wrong.' }
      ],
      takeaway: 'We are all poor judges of our own competence in unfamiliar areas. The meme is a reason to look for feedback, not to diagnose others.',
      prompt: 'In what area might you be most confident, and have the least feedback?'
    },
    {
      id: 'layers-four-noble-truths', type: 'layers', topic: 'religion', diff: 1, mins: 3,
      title: 'The Buddha as a Doctor',
      hook: 'The foundation of Buddhism is built like a medical diagnosis.',
      links: ['psychology', 'philosophy', 'history'], thinkers: ['The Buddha'],
      guess: { q: 'Traditional texts describe the Buddha’s first teaching as structured like which of these?', options: ['A creation myth', 'A medical diagnosis and treatment', 'A legal code'], answer: 1 },
      layers: [
        { h: '1. The condition (dukkha)', t: 'Life contains suffering, or more precisely “unsatisfactoriness”: pain, loss, and the restlessness that follows even pleasure.' },
        { h: '2. The cause (samudaya)', t: 'The Buddha traced it to craving and clinging: wanting things to be permanent when they are not.' },
        { h: '3. The prognosis (nirodha)', t: 'It can end. This cessation is called nirvana, “blowing out” like a flame.' },
        { h: '4. The treatment (magga)', t: 'The Eightfold Path: right view, intention, speech, action, livelihood, effort, mindfulness and concentration. It is a training of conduct, attention and understanding.' },
        { h: 'Interpretations', t: 'The “physician” image is common in the texts, where the Buddha is called a great doctor. Different schools (Theravada, Mahayana, Zen and others) interpret the path and nirvana in different ways, and scholars disagree about early details.' }
      ],
      takeaway: 'The Four Noble Truths follow the form of a diagnosis: the condition, its cause, the prognosis and the treatment.',
      prompt: 'Which craving causes you the most unease, and what happens when you notice it?'
    },
    {
      id: 'layers-linear-perspective', type: 'layers', topic: 'arts', diff: 2, mins: 3,
      title: 'The Day Painting Learned Depth',
      hook: 'A Florentine architect, a mirror and a hole in a panel changed how Europe sees.',
      links: ['history', 'science', 'geography'], thinkers: ['Filippo Brunelleschi', 'Leon Battista Alberti'],
      guess: { q: 'Before the early 1400s, European painters generally lacked what?', options: ['A unified mathematical system for depth', 'Access to colour', 'The idea of portraits'], answer: 0 },
      layers: [
        { h: 'Before perspective', t: 'Medieval painting often made figures larger for importance, not nearness. Space was symbolic, not measured.' },
        { h: 'The experiment', t: 'Around 1415–20, Filippo Brunelleschi is reported (by his biographer Manetti) to have painted Florence’s Baptistery on a panel. A viewer looked through a hole in the back at its reflection in a mirror, and compared it to the real building. The match was uncanny.' },
        { h: 'The theory', t: 'In 1435, Leon Battista Alberti described the method in De pictura: imagine the picture as a window onto the scene, with lines converging on a vanishing point.' },
        { h: 'Early masterpieces', t: 'Masaccio’s Holy Trinity (c. 1427) shows the new depth in a fresco. Within a few decades the method had spread across Italy and beyond.' },
        { h: 'Not the only way', t: 'Other traditions made different choices for different goals: Chinese scroll paintings invite the eye to wander through shifting viewpoints, and Islamic miniatures often favour pattern over depth. Perspective is one solution to one problem, not a stage of progress.' }
      ],
      takeaway: 'Linear perspective is a technique that made painting mathematical, and one of several valid ways of picturing space.',
      prompt: 'What do you notice differently in a painting once you look for its vanishing point?'
    },
    {
      id: 'layers-eratosthenes', type: 'layers', topic: 'geography', diff: 1, mins: 3,
      title: 'Measuring the Earth with a Stick',
      hook: 'Around 240 BCE, a librarian worked out the size of the planet using a shadow.',
      links: ['science', 'history', 'thinkers'], thinkers: ['Eratosthenes'],
      guess: { q: 'What was Eratosthenes’s key observation?', options: ['The Earth’s curved shadow on the Moon', 'At noon on the summer solstice the Sun was straight overhead in Syene, but a vertical rod in Alexandria cast a shadow', 'The way ships disappear over the horizon'], answer: 1 },
      layers: [
        { h: 'The geometry', t: 'In Alexandria, the shadow showed the Sun was about 7.2° from vertical, about 1/50 of a full circle. If Syene was 1/50 of the circumference away, the Earth must be 50 times that distance around.' },
        { h: 'The numbers', t: 'The distance was reported as about 5,000 stadia, giving about 250,000 stadia in total.' },
        { h: 'How good was it?', t: 'It depends on which “stadion” he meant. With some definitions the answer is within a few percent of the true figure (about 40,075 km), with others about 15% too large. Syene is not exactly due south of Alexandria, and the distance was a rough estimate, so some luck was involved.' },
        { h: 'The myth to drop', t: 'Educated Greeks already knew the Earth was round. The idea that medieval Europeans believed in a flat Earth, and that Columbus proved otherwise, is largely a 19th-century legend.' },
        { h: 'The man', t: 'Eratosthenes also coined the word “geography” and directed the great Library of Alexandria.' }
      ],
      takeaway: 'A clear question, a measurement and some geometry were enough to measure a planet.',
      prompt: 'What big thing could you estimate with a simple measurement and a clever idea?'
    },
    {
      id: 'layers-weird-psychology', type: 'layers', topic: 'geography', diff: 2, mins: 3,
      title: 'Do All Humans See the Same Lines?',
      hook: 'A simple optical illusion revealed that much of psychology studies a very small slice of humanity.',
      links: ['psychology', 'science', 'society'], thinkers: ['Joseph Henrich', 'Marshall Segall'],
      guess: { q: 'In the 1960s, people in some non-Western societies were less fooled by the Müller-Lyer illusion. A leading explanation?', options: ['Poorer eyesight', 'Their surroundings contain fewer right-angled “carpentered” corners', 'They did not understand the task'], answer: 1 },
      layers: [
        { h: 'The illusion', t: 'Two lines of equal length look unequal when one has outward-pointing arrowheads and the other inward-pointing ones. In Western samples almost everyone is fooled.' },
        { h: 'The cross-cultural study', t: 'Segall, Campbell and Herskovits (1966) tested people in many societies. The size of the illusion varied widely, and some groups were barely affected.' },
        { h: 'The explanation', t: 'The “carpentered world” hypothesis proposes that people who grow up among right-angled buildings learn to interpret such angles as depth cues. The interpretation is still debated.' },
        { h: 'The bigger point', t: 'Henrich, Heine and Norenzayan (2010) noted that about 96% of subjects in leading psychology journals came from Western industrialised countries with roughly 12% of the world’s population. Many findings about “human nature” may describe a “WEIRD” (Western, Educated, Industrialised, Rich, Democratic) slice of it.' },
        { h: 'Beyond vision', t: 'Cross-cultural differences have also been reported in fairness norms, moral reasoning and sense of self, which is why researchers now stress testing findings more widely.' }
      ],
      takeaway: 'Before assuming something is human nature, ask who was actually studied.',
      prompt: 'What do you assume is “just how people are” that might simply be how people you know are?'
    },
    {
      id: 'layers-ada-lovelace', type: 'layers', topic: 'thinkers', diff: 2, mins: 3,
      title: 'The Notes That Imagined Computers',
      hook: 'In 1843, a mathematician described a machine that did not yet exist and what it might one day do.',
      links: ['science', 'arts', 'history'], thinkers: ['Ada Lovelace', 'Charles Babbage'],
      guess: { q: 'What is Ada Lovelace’s “Note G” famous for?', options: ['A step-by-step method for Babbage’s Analytical Engine to compute Bernoulli numbers', 'The invention of the telegraph', 'The first mechanical calculator'], answer: 0 },
      layers: [
        { h: 'The machine', t: 'Charles Babbage designed the Analytical Engine in the 1830s: a general-purpose mechanical computer to be programmed with punched cards, an idea borrowed from the Jacquard loom. It was never built.' },
        { h: 'The notes', t: 'Lovelace translated a French article about the engine in 1842 and added her own Notes, about three times as long as the original. Note G sets out how the engine would calculate Bernoulli numbers.' },
        { h: 'The deeper idea', t: 'She saw that such a machine could manipulate not just numbers but any symbols that follow rules, so it might even compose music. She also stressed that it could not originate anything itself, an idea Alan Turing later discussed as “Lady Lovelace’s objection.”' },
        { h: 'The debate', t: 'Historians disagree about how much of the mathematics was hers versus Babbage’s. Some argue her role has been overstated. Others emphasise that her conceptual leap, about what computing could mean, was her own.' }
      ],
      takeaway: 'Lovelace’s lasting insight was about the nature of computation: machines that handle symbols can do far more than arithmetic.',
      prompt: 'What does a machine do today that you did not think rules could capture?'
    },
    {
      id: 'layers-ibn-al-haytham', type: 'layers', topic: 'thinkers', diff: 2, mins: 3,
      title: 'The Man Who Tested How We See',
      hook: 'For centuries it was believed that vision worked by rays shooting from the eye. One scholar in Cairo experimented.',
      links: ['science', 'history', 'philosophy'], thinkers: ['Ibn al-Haytham'],
      guess: { q: 'What did Ibn al-Haytham argue against in his Book of Optics (c. 1011–1021)?', options: ['That light travels in straight lines', 'That vision works by rays emitted from the eye', 'That the Earth is round'], answer: 1 },
      layers: [
        { h: 'The old theory', t: 'Many ancient thinkers, including Euclid and Ptolemy, held that we see by sending rays from our eyes to objects. Others held that objects send images to the eye.' },
        { h: 'The arguments', t: 'Ibn al-Haytham argued that light enters the eye. Looking at the Sun hurts, and staring at bright objects leaves afterimages, as if something had been received by the eye, not sent from it.' },
        { h: 'The method', t: 'He used experiments: the camera obscura (a dark room with a small hole), tests of reflection and refraction, and careful controls. His text stresses verifying by observation.' },
        { h: 'The reputation', t: 'Latin translations of the Book of Optics (c. 1200) influenced European scholars including Roger Bacon and Kepler. He is often called a “father of the scientific method,” but historians note that science did not have one single method, and that such labels simplify.' }
      ],
      takeaway: 'Challenging a revered theory with a controlled experiment is one of the great ideas of science, and it was practised by many cultures.',
      prompt: 'What “obvious” belief of yours could you test with a simple experiment?'
    },
    {
      id: 'layers-godel', type: 'layers', topic: 'science', diff: 3, mins: 3,
      title: 'The Limits of Proof',
      hook: 'In 1931, a young logician proved that mathematics will always contain truths it cannot prove.',
      links: ['philosophy', 'thinkers', 'literature'], thinkers: ['Kurt Gödel', 'David Hilbert', 'Alan Turing'],
      guess: { q: 'What do Gödel’s incompleteness theorems (1931) show?', options: ['Mathematics is inconsistent', 'Any consistent formal system rich enough for arithmetic has true statements it cannot prove', 'All truth is relative'], answer: 1 },
      layers: [
        { h: 'The dream', t: 'David Hilbert hoped to place all of mathematics on a complete, provably consistent foundation, a finite set of axioms from which every truth could be derived.' },
        { h: 'The trick', t: 'Gödel found a way to encode statements about a system as numbers inside the system. That let him build a sentence that says, in effect, “This sentence cannot be proved in this system.”' },
        { h: 'The consequence', t: 'If the system could prove that sentence, it would be proving something false, so it would be inconsistent. If the system is consistent, the sentence cannot be proved, yet it is true. A second theorem: such a system cannot prove its own consistency.' },
        { h: 'What it does not mean', t: 'It does not mean “truth is relative” or that mathematics is unreliable. Arguments that it proves human minds transcend machines (Lucas, Penrose) are widely criticised.' },
        { h: 'The legacy', t: 'In 1936 Alan Turing proved a closely related limit: no general algorithm can decide whether every program will halt. The boundary of what can be computed is also the boundary of what can be proved.' }
      ],
      takeaway: 'Some truths cannot be reached by any fixed set of rules, and we can prove that.',
      prompt: 'Is there anything you hold true that you could never prove?'
    }
  );
})();
