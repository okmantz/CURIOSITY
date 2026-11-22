/* Interactive Explorations, Literature Experiences, Knowledge Connections */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.library = C.library || [];

  /* ---------- Interactive Explorations ---------- */
  C.library.push(
    {
      id: 'axial-age-timeline', type: 'explore', kind: 'timeline', topic: 'history', diff: 2, mins: 3,
      title: 'When the World Started Asking Why',
      hook: 'Between 800 and 200 BCE, thinkers in China, India, Persia, Israel and Greece began asking strikingly similar questions.',
      links: ['philosophy', 'religion', 'thinkers'], thinkers: ['Confucius', 'The Buddha', 'Socrates', 'Karl Jaspers'],
      intro: 'Drag the slider through time. Watch where ideas appear. The philosopher Karl Jaspers called this period the “Axial Age” (1949).',
      range: [-800, -300],
      regions: { india: 'India', china: 'China', greece: 'Greece', levant: 'Levant' },
      events: [
        { y: -750, region: 'levant', label: 'Prophets such as Isaiah (8th century BCE) challenge kings with ethical demands.' },
        { y: -700, region: 'india', label: 'The early Upanishads begin to be composed (c. 800–500 BCE) and ask what the self is.' },
        { y: -586, region: 'levant', label: 'The Babylonian exile begins. Israelite religion is reshaped around texts and ethics.' },
        { y: -551, region: 'china', label: 'Confucius is born (traditional date), a thinker of ritual, learning and ethical example.' },
        { y: -480, region: 'india', label: 'The Buddha teaches in the Ganges plain (traditional dates 563–483; many scholars place him later).' },
        { y: -470, region: 'greece', label: 'Socrates is born in Athens and later makes questioning a way of life.' },
        { y: -428, region: 'greece', label: 'Plato is born. His Academy follows in the 380s BCE.' },
        { y: -384, region: 'greece', label: 'Aristotle is born and later founds the Lyceum.' },
        { y: -369, region: 'china', label: 'Zhuangzi is born (traditional dating), a Daoist storyteller of paradox and play.' }
      ],
      reveal: 'These societies were mostly out of contact, yet each saw thinkers turn to universal ethics, the nature of the self, and the question of how to live. Critics of the “Axial Age” idea argue it generalises too much and downplays earlier traditions. Was it a pattern, or a story we tell?',
      takeaway: 'Similar questions emerged in different civilisations at around the same time. Whether that is coincidence or pattern is itself a debated question.',
      prompt: 'What might cause several societies to start asking big questions at once?'
    },
    {
      id: 'powers-of-ten', type: 'explore', kind: 'scale', topic: 'science', diff: 1, mins: 2,
      title: 'Forty-Two Orders of Magnitude',
      hook: 'Slide from a proton to the observable universe. Notice where you, a human, sit.',
      links: ['geography', 'philosophy'], thinkers: [],
      intro: 'Each step is ten times bigger. Drag the slider (in metres, as a power of ten) and see what lives at each scale.',
      range: [-15, 27],
      points: [
        { e: -15, label: 'A proton', note: 'About 1.7 femtometres across.' },
        { e: -10, label: 'A hydrogen atom', note: 'About one ångström (10⁻¹⁰ m). Mostly empty space around the nucleus.' },
        { e: -9, label: 'DNA double helix', note: 'About 2 nanometres wide, yet a human cell’s DNA would stretch about 2 metres if uncoiled.' },
        { e: -5, label: 'A red blood cell', note: 'About 8 micrometres across.' },
        { e: -3, label: 'An ant', note: 'A few millimetres.' },
        { e: 0, label: 'You', note: 'Roughly human height, about 1.7 m. Atoms are about ten billion times smaller, and the Earth about ten million times bigger.' },
        { e: 4, label: 'Mount Everest', note: 'About 8.8 km high.' },
        { e: 7, label: 'The Earth', note: 'About 12,700 km across.' },
        { e: 9, label: 'The Sun', note: 'About 1.4 million km across; roughly 109 Earths in a line.' },
        { e: 12, label: 'Orbit of Jupiter', note: 'About 7.8 × 10¹¹ m from the Sun.' },
        { e: 16, label: 'One light-year', note: 'About 9.46 × 10¹⁵ m, the distance light travels in a year.' },
        { e: 21, label: 'The Milky Way', note: 'About 100,000 light-years across.' },
        { e: 26, label: 'The observable universe', note: 'About 8.8 × 10²⁶ m in diameter, about 93 billion light-years.' }
      ],
      reveal: 'Humans sit in the middle of this enormous range, but we are not the centre of anything. The same laws, though, seem to apply from the proton to the cosmos. That is itself astonishing.',
      takeaway: 'We live at a single, tiny slice of a hugely larger range of scales, and we can still measure all of it.',
      prompt: 'Which scale did you find hardest to picture, and why?'
    },
    {
      id: 'mercator-distortion', type: 'explore', kind: 'mercator', topic: 'geography', diff: 1, mins: 2,
      title: 'The Map That Lies Politely',
      hook: 'On the familiar world map, Greenland looks as big as Africa. It is about one-fourteenth the size.',
      links: ['history', 'science', 'society'], thinkers: ['Gerardus Mercator'],
      intro: 'Move the slider away from the equator. The circle shows the same true area at each latitude, as the Mercator map draws it.',
      facts: 'Greenland is about 2.17 million km². Africa is about 30.4 million km², about 14 times larger.',
      reveal: 'Gerardus Mercator designed this projection in 1569 for sailors: a straight line on it keeps a constant compass bearing. That made it brilliant for navigation, and misleading as a picture of size. Alternatives such as the Gall–Peters equal-area map or the Winkel tripel (adopted by National Geographic in 1998) trade distortions differently. Every flat map of a sphere distorts something.',
      takeaway: 'Every map is a choice about which truths to keep. The one you grew up with shaped your sense of the world’s size.',
      prompt: 'What else do you “know” because you grew up seeing it presented a certain way?'
    },
    {
      id: 'sound-of-ratios', type: 'explore', kind: 'intervals', topic: 'arts', diff: 1, mins: 3,
      title: 'Why Some Notes Sound Like Home',
      hook: 'Pythagoras is said to have found that harmony hides in simple whole-number ratios. Hear it for yourself.',
      links: ['science', 'history', 'psychology'], thinkers: ['Pythagoras'],
      intro: 'Press each interval to hear two notes sound together. The graph shows the combined wave. Simple ratios repeat quickly, while complex ones take longer to line up.',
      reveal: 'Pythagoras is said (by later legend) to have discovered that strings in simple ratios sound consonant: 2:1 is the octave and 3:2 the fifth. Modern theories link it to how often waves line up, and to how the ear processes overtones. But culture matters too: a 2016 study of the Tsimane people of the Bolivian Amazon found little preference for consonant over dissonant chords, suggesting that our taste for them is partly learned.',
      takeaway: 'Maths shapes music, but culture shapes what we hear as beautiful.',
      prompt: 'Which interval sounded most settled to you, and which most restless?'
    },
    {
      id: 'wason-lab', type: 'explore', kind: 'wason', topic: 'psychology', diff: 2, mins: 3,
      title: 'Find the Hidden Rule',
      hook: 'The sequence 2, 4, 6 follows a rule. Your job is to discover it, and most people get it wrong.',
      links: ['science', 'philosophy', 'wisdom'], thinkers: ['Peter Wason', 'Karl Popper'],
      intro: 'I have a secret rule for number triples. 2, 4, 6 fits it. Test your own triples to see whether they fit, then guess the rule. You have up to ten tests.',
      reveal: 'The rule is simply: any increasing sequence. Psychologist Peter Wason (1960) found that most people propose something narrow (“going up by two”) and then test only triples that fit it, hearing “yes” each time and never discovering they are wrong. The informative test is one that could fail. Karl Popper made this a cornerstone of science: seek to falsify, not to confirm.',
      takeaway: 'To test an idea, try to break it. Confirming examples are cheap, and refuting ones are valuable.',
      prompt: 'Think of a belief you hold. What test could prove it wrong?'
    }
  );

  /* ---------- Literature Experiences ----------
     Text markers: [[phrase::annotation]] become tappable. All works are in the public domain. */
  C.library.push(
    {
      id: 'lit-ozymandias', type: 'literature', topic: 'literature', diff: 2, mins: 3,
      title: 'Ozymandias',
      hook: 'A poem about a king who wanted to be remembered forever, and the sand that disagreed.',
      links: ['history', 'philosophy', 'arts'], thinkers: ['Percy Bysshe Shelley'],
      work: 'Ozymandias', author: 'Percy Bysshe Shelley', year: 1818, form: 'Sonnet',
      lines: [
        'I met a [[traveller from an antique land::Antique means ancient. Shelley never saw Egypt. The poem is told at second hand, a story within a story.]],',
        'Who said—“Two vast and trunkless legs of stone',
        'Stand in the desert. . . . Near them, on the sand,',
        'Half sunk a [[shattered visage lies::A broken face. The statue has been reduced to fragments, and the figure of power has been literally dismembered.]], whose frown,',
        'And wrinkled lip, and sneer of cold command,',
        'Tell that its sculptor well those passions read',
        'Which yet survive, stamped on these lifeless things,',
        'The [[hand that mocked them, and the heart that fed::“Mocked” means both imitated and ridiculed. The sculptor’s hand copied the passions; the king’s heart fed them. The artist survives, and the tyrant’s emotions are all that remain.]];',
        'And on the pedestal, these words appear:',
        '[[“My name is Ozymandias, King of Kings;::Ozymandias is the Greek name for Ramesses II. The historian Diodorus Siculus recorded an inscription with similar boasting.]]',
        'Look on my Works, ye Mighty, and despair!”',
        '[[Nothing beside remains.::The most devastating line. Despair was meant as fear of his power. It now reads as despair at how little lasts.]] Round the decay',
        'Of that colossal Wreck, boundless and bare',
        'The lone and level sands stretch far away.'
      ],
      context: 'Shelley wrote this in 1818 in friendly competition with his friend Horace Smith, who wrote a poem on the same subject. The poem has several layers of narration: Shelley, the traveller, the sculptor, and the king.',
      lifeQ: 'Shelley contrasts what we build to be remembered with what time does. What do people today build in hopes of lasting, and what might outlast it?',
      takeaway: 'Power hopes to be permanent. Art about power often survives it, but the sculptor’s craft outlasts the king.',
      prompt: 'What are you building that you hope will last?'
    },
    {
      id: 'lit-macbeth-tomorrow', type: 'literature', topic: 'literature', diff: 2, mins: 3,
      title: 'Tomorrow, and Tomorrow, and Tomorrow',
      hook: 'Macbeth has just lost everything. His response is one of the bleakest speeches in English.',
      links: ['philosophy', 'psychology', 'history'], thinkers: ['William Shakespeare'],
      work: 'Macbeth, Act 5, Scene 5', author: 'William Shakespeare', year: 1606, form: 'Soliloquy',
      lines: [
        '[[Tomorrow, and tomorrow, and tomorrow,::The repetition creates the plod of time itself. Notice the rhythm: relentless, almost numbing.]]',
        'Creeps in this petty pace from day to day',
        'To the [[last syllable of recorded time;::Time is imagined as a book, or a speech, with a final syllable. The universe is reduced to a script that ends.]]',
        'And all our yesterdays have lighted fools',
        'The way to dusty death. Out, out, brief candle!',
        'Life’s but a [[walking shadow, a poor player::A player is an actor. Life is a shadow, an insubstantial thing that only imitates.]]',
        'That struts and frets his hour upon the stage',
        'And then is heard no more: it is a tale',
        'Told by an idiot, full of sound and fury,',
        '[[Signifying nothing.::The final blow: after all the noise, nothing means anything. Is this Macbeth’s truth, or the despair of a man who destroyed everything meaningful?]]'
      ],
      context: 'Macbeth says this on hearing that Lady Macbeth is dead. He has murdered to become king, and now finds no meaning in it. The speech is not Shakespeare’s own philosophy: it is a character in despair. William Faulkner took the title The Sound and the Fury from it.',
      lifeQ: 'Macbeth sees time as a pointless march. Is meaninglessness a fact about the world, or a feeling produced by what he has done?',
      takeaway: 'A character’s despair is not an author’s verdict. Literature lets us feel a worldview from inside, and decide whether we accept it.',
      prompt: 'When have you felt that nothing mattered, and what changed?'
    },
    {
      id: 'lit-dickinson-hope', type: 'literature', topic: 'literature', diff: 1, mins: 2,
      title: 'Hope Is a Bird',
      hook: 'Emily Dickinson compresses an entire philosophy of hope into four short lines.',
      links: ['psychology', 'wisdom', 'arts'], thinkers: ['Emily Dickinson'],
      work: '“Hope” is the thing with feathers', author: 'Emily Dickinson', year: 1861, form: 'Lyric poem (first stanza)',
      lines: [
        '“[[Hope” is the thing with feathers::Dickinson does not define hope. She gives it a body: a bird. A metaphor that stays an image, never explained.]] —',
        'That [[perches in the soul::A perch is a temporary rest. Hope is not nailed down: it lands, and it can fly.]] —',
        'And [[sings the tune without the words::Hope is wordless: a feeling, not an argument. It does not need a reason to sing.]] —',
        'And [[never stops—at all—::The dashes slow the line, making the stopping, and the not-stopping, almost audible.]]'
      ],
      context: 'Dickinson wrote nearly 1,800 poems and published only a handful in her lifetime. Her dashes and unusual punctuation have been much debated by editors. Later in this poem, the bird sings in storms and never asks anything in return, even in extremity.',
      lifeQ: 'Dickinson says hope sings “without the words,” with no reasons. Is hope more like a feeling or a decision?',
      takeaway: 'Poetry makes an abstraction visible. Hope is not argued for; it is shown as something small, alive, and persistent.',
      prompt: 'If hope were a creature for you, what would it be?'
    }
  );

  /* ---------- Knowledge Connections ---------- */
  C.library.push(
    {
      id: 'conn-stoicism-cbt', type: 'connections', topic: 'psychology', diff: 2, mins: 3,
      title: 'From Roman Slave to Modern Therapy',
      hook: 'A freed slave in the first century and a psychiatrist in the twentieth shared a surprising idea.',
      links: ['philosophy', 'thinkers', 'wisdom'], thinkers: ['Epictetus', 'Albert Ellis', 'Aaron Beck'],
      chain: [
        { name: 'Epictetus', sub: 'Stoic teacher, c. 50–135 CE' },
        { name: 'Albert Ellis', sub: 'Rational emotive therapy, 1950s' },
        { name: 'Aaron Beck', sub: 'Cognitive therapy, 1960s' },
        { name: 'Modern CBT', sub: 'Today’s most-studied talk therapy' }
      ],
      bridges: [
        { q: 'Epictetus taught that people are disturbed not by things, but by their views of them. How does that connect to Albert Ellis?', options: ['Ellis rejected it completely', 'Ellis built a therapy on it and cited the Stoics as an inspiration', 'There is no connection; it is a coincidence'], correct: 1, explain: 'Ellis explicitly credited Epictetus and other Stoics when developing rational emotive therapy in the 1950s: distress is driven by our beliefs about events, so change the beliefs.' },
        { q: 'Beck developed cognitive therapy independently. What practical method did he share with the Stoics?', options: ['Noticing automatic thoughts and testing them against evidence', 'Fasting and cold exposure', 'Interpreting dreams'], correct: 0, explain: 'Beck also acknowledged Stoic roots. A patient notices an automatic thought (“I always fail”), examines the evidence, and replaces it with a more accurate one. Epictetus urged his students to check their impressions before assenting.' },
        { q: 'What does today’s evidence say about cognitive-behavioural therapy?', options: ['It has been tested in many studies and is effective for several conditions', 'It has never been tested', 'It is proven to cure all psychological problems'], correct: 0, explain: 'CBT is among the most researched psychotherapies and has good support for anxiety and depression, among others, though it does not work for everyone and is not a cure-all.' }
      ],
      reveal: 'An idea can travel two thousand years without being a doctrine: Stoics, therapists and patients each rediscovered that how we interpret events shapes how we feel. Note that modern therapy is empirical, and borrows the idea, not the whole philosophy.',
      takeaway: 'Ancient philosophy and modern psychology are linked: both hold that our interpretations of events shape our suffering.',
      prompt: 'What interpretation of a recent event could you test against the evidence?'
    },
    {
      id: 'conn-polybius-montesquieu', type: 'connections', topic: 'society', diff: 2, mins: 3,
      title: 'The Ancient Blueprint of Modern Government',
      hook: 'The idea that power should check power travelled from a Greek historian in Rome to the American Constitution.',
      links: ['history', 'philosophy', 'thinkers'], thinkers: ['Polybius', 'Montesquieu', 'James Madison'],
      chain: [
        { name: 'Polybius', sub: 'Greek historian in Rome, c. 150 BCE' },
        { name: 'Montesquieu', sub: 'The Spirit of the Laws, 1748' },
        { name: 'James Madison', sub: 'Federalist Papers, 1788' },
        { name: 'Modern constitutions', sub: 'Checks and balances' }
      ],
      bridges: [
        { q: 'Polybius asked why Rome rose so fast. What did he think kept its government stable?', options: ['A mixture of monarchy, aristocracy and democracy that checked one another', 'One all-powerful emperor', 'A written bill of rights'], correct: 0, explain: 'In Book 6 of his Histories, Polybius described Rome’s consuls, Senate and popular assemblies as balancing each other, preventing the cycle of decline he thought afflicted simple forms of government.' },
        { q: 'What did Montesquieu add in 1748?', options: ['That a king should rule absolutely', 'That legislative, executive and judicial powers should be separated', 'That all citizens should rule directly'], correct: 1, explain: 'Observing the English system, Montesquieu argued that liberty requires that no single body holds all the powers of making, enforcing and judging laws.' },
        { q: 'How did this reach the US Constitution?', options: ['Madison cited Montesquieu directly when defending separation of powers', 'The framers had never heard of him', 'It was copied from Rome word for word'], correct: 0, explain: 'In Federalist No. 47, Madison cites “the celebrated Montesquieu” as the oracle on the topic. The framers also drew on Locke, English history, and their own colonial experience.' }
      ],
      reveal: 'Ideas often arrive in the present by a long chain. The structure behind many modern governments is not one inventor’s plan but centuries of people noticing that unchecked power tends to be abused.',
      takeaway: 'Today’s institutions are the end of a long argument. Understanding the argument helps us see what they are for.',
      prompt: 'What checks on power in your own life, such as work or family, keep things balanced?'
    },
    {
      id: 'conn-frankenstein', type: 'connections', topic: 'literature', diff: 2, mins: 3,
      title: 'A Volcano, a Storm, and a Monster',
      hook: 'How an eruption in Indonesia helped produce one of the most famous novels ever written.',
      links: ['science', 'history', 'psychology'], thinkers: ['Mary Shelley', 'Luigi Galvani'],
      chain: [
        { name: 'Tambora erupts', sub: 'Indonesia, April 1815' },
        { name: 'Year Without a Summer', sub: '1816' },
        { name: 'Villa Diodati', sub: 'Ghost-story contest, Switzerland' },
        { name: 'Frankenstein', sub: 'Published 1818' }
      ],
      bridges: [
        { q: 'What does an Indonesian volcano have to do with a novel written in Switzerland?', options: ['The ash and aerosols cooled the climate; cold, wet weather kept a group of writers indoors', 'The author lived in Indonesia', 'The eruption was the novel’s plot'], correct: 0, explain: 'Tambora’s 1815 eruption, among the largest in recorded history, helped cause cold, stormy weather in 1816 across Europe. Mary Shelley, Percy Shelley, Lord Byron and John Polidori were stuck indoors near Lake Geneva.' },
        { q: 'Byron proposed that each guest write a ghost story. What scientific idea of the time fed Mary Shelley’s?', options: ['Galvanism: experiments showing electricity could make dead tissue twitch', 'Evolution by natural selection', 'Germ theory'], correct: 0, explain: 'Luigi Galvani’s experiments (1780s) and public demonstrations by his nephew Giovanni Aldini (1803) suggested electricity and life might be linked, raising unsettling questions about what life is. Darwin’s book came decades later.' },
        { q: 'Why does Frankenstein still matter?', options: ['It asks what scientists owe to what they create', 'It is a manual for anatomy', 'It was written to attack all science'], correct: 0, explain: 'The novel is often read as a question about responsibility: Victor abandons what he creates. It speaks to debates from genetic engineering to artificial intelligence.' }
      ],
      reveal: 'Great literature rarely appears from nowhere. Climate, science, friendship and chance can all leave fingerprints on a book, and a book can reflect questions its age had not yet answered.',
      takeaway: 'Frankenstein came from weather, science and a bet among friends, and its central question is still ours.',
      prompt: 'What present-day invention could inspire the next Frankenstein?'
    }
  );
})();
