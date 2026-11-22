/* Rabbit Holes, part A: Philosophy (the cave), History, Religion, Literature.
   Node types: read, choice(+ans), compare, ladder, sort, scale, reveal, fig, link, mirror, sim. */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.HOLES = C.HOLES || [];

  /* ============ PHILOSOPHY: Plato’s cave ============ */
  C.HOLES.push({
    id: 'plato-cave', anchor: 'allegory-of-the-cave', topic: 'philosophy', title: 'Plato’s Cave',
    hook: 'One image from about 375 BCE, still asking whether what we take for reality is only its shadow.',
    claim: 'The world as it appears to us is only a shadow of something truer.',
    anti: 'What we perceive is the real world, and there is no truer one behind it.',
    themes: ['knowledge', 'perception'], related: ['maps-lie', 'confirmation-trap', 'good-life-machine'],
    paths: [
      { id: 'original', kind: 'origin', title: 'The original story', blurb: 'Plato’s own telling, step by step, in Republic Book VII.', mins: 5, nodes: [
        { t: 'read', h: 'Where it comes from', p: ['The Allegory of the Cave appears at the start of Book VII of Plato’s Republic, written around 375 BCE. Socrates tells it to Glaucon as a picture of “our nature in respect of education and its lack.”', 'It follows two other images: the Sun, which stands for the Form of the Good, and the Divided Line, which ranks kinds of cognition from imagining and belief up to understanding. The cave puts those into a story.'] },
        { t: 'read', h: 'The setting', p: ['Prisoners have been chained since childhood in an underground cave, facing a wall, unable to turn their heads. Behind and above them a fire burns. Between the fire and the prisoners people carry statues and objects of all kinds along a low wall, like puppeteers, and the shadows fall on the wall in front of the prisoners.', 'The prisoners hear echoes and see only shadows. They name them, and the ones who are best at remembering and predicting what passes are honoured.'] },
        { t: 'choice', q: 'What do the prisoners take the shadows to be?', ans: 0, opts: [['The real things themselves', 'Yes. Plato says they would believe that the shadows are the truth, because it is all they have ever known.'], ['Copies of something else', 'No. They have no idea there is anything else. That is exactly the point of the image.'], ['Tricks played by the puppeteers', 'No. They do not know the puppeteers exist.']], why: 'Yes. For the prisoners the shadows are simply reality. They have no reason to suspect otherwise.' },
        { t: 'read', h: 'The release', p: ['One prisoner is freed and forced to stand and turn. His eyes hurt in the glare of the fire. If someone told him that what he saw before was nonsense, and that he is now closer to what is real, he would be perplexed and think the old shadows truer than the objects now shown to him.', 'He is then dragged up the rough ascent into the sunlight. At first he can look only at shadows, then at reflections in water, then at things themselves, then at the night sky, and last of all at the sun.'] },
        { t: 'read', h: 'The return, and what it means', p: ['If he went back down, his eyes would be slow to adjust to the dark, and the prisoners would say he came back with ruined sight. They would not want to be freed, and Plato says that if they could, they would kill the person who tried to lead them up.', 'Plato then explains the picture: the cave is the visible world, the fire is the sun, the ascent is the soul’s journey toward understanding, and the sun is the Form of the Good, the source of everything that makes things intelligible. The philosopher who has seen it must return and take a turn at ruling, though reluctantly.'] },
        { t: 'choice', q: 'In Plato’s explanation, what does the sun outside the cave stand for?', ans: 1, opts: [['Human reason', 'Close, but Plato would say reason is the eye. The sun is what it sees by.'], ['The Form of the Good', 'Yes. It is what makes both the knowable things and our knowing of them possible.'], ['The state', 'No. Plato’s ideal state is described elsewhere in the Republic.']], why: 'Yes. The sun is the Form of the Good, the source of both truth and understanding.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'enter', kind: 'play', title: 'Enter the cave', blurb: 'Predict the shadows, turn around, climb out and go back down.', mins: 5, nodes: [
        { t: 'read', h: 'An interactive cave', p: ['You will play the prisoner. The game follows the stages of Plato’s story. Your choices are not graded; each one meets a prediction Plato made, or a reply a critic made to him.'] },
        { t: 'sim', id: 'cave' },
        { t: 'mirror', n: 2, kinds: ['assume', 'connect'] }
      ] },
      { id: 'psychology', kind: 'compare', title: 'Plato and modern psychology', blurb: 'Do our brains show us shadows? Where psychology agrees with Plato, and where it parts.', mins: 5, nodes: [
        { t: 'read', h: 'A surprisingly modern suspicion', p: ['Cognitive science has its own version of the cave. Hermann von Helmholtz argued in the 1860s that perception involves “unconscious inference”: the brain guesses at the causes of its sensory signals. Many researchers now describe perception as prediction. Neuroscientist Anil Seth calls it a “controlled hallucination”: a best guess about the world that is constantly corrected by incoming data.'] },
        { t: 'choice', q: 'In the Müller-Lyer illusion, two lines of equal length look unequal because of the arrowheads at their ends. Does knowing they are equal make the illusion go away?', ans: 1, opts: [['Yes, once you know the truth you see it correctly', 'Not usually. That is the interesting part.'], ['No. The lines still look unequal', 'Right. Knowing a truth and perceiving it are separate. Plato would say you can be told about the sun and still see shadows.'], ['It depends on your culture only', 'Susceptibility does vary across cultures, but even people who know the lines are equal still see the effect.']], why: 'Right. The lines keep looking unequal even when you know better. What you believe and what you see can come apart.' },
        { t: 'compare', h: 'Where the two pictures meet and where they split', cols: [{ h: 'Plato', pts: ['Appearances are copies of a higher, unchanging reality (the Forms).', 'Reason can reach that reality; the senses only mislead.', 'Education is turning the soul toward the truth.'] }, { h: 'Modern psychology', pts: ['Perception is a model the brain builds from signals plus expectations.', 'The model is tested against the world; senses are a necessary input, not a mere distraction.', 'There is no evidence of a higher realm of Forms, but plenty about how beliefs bias what we notice.'] }], q: 'Which picture of how we know does your own experience support?', note: 'Plato’s Forms are not part of mainstream psychology. What the two share is the worry that how things seem and how they are can differ, and that we are poor at noticing the gap.' },
        { t: 'read', h: 'The prisoners’ loyalty to their shadows', p: ['Psychology also describes why the prisoners resist. Belief perseverance is the tendency to hold on to a belief after its evidence is discredited. In Festinger’s 1956 study of a doomsday group, When Prophecy Fails, many members became more committed after the predicted date passed.', 'You may have heard of a “backfire effect,” where correcting someone strengthens their false belief. A 2010 study reported it, but later larger studies (for example Wood and Porter, 2019) found it rare. People more often update a little than dig in. So the image of every prisoner violently resisting is too strong; the truer picture is slow, partial updating.'] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'origin'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Objections to Plato’s argument', blurb: 'Five serious replies, from his own pupil to modern critics.', mins: 6, nodes: [
        { t: 'ladder', h: 'Five objections', claim: 'There is a higher, truer reality than the one our senses show us, and philosophical reason can reach it.', rungs: [
          { o: 'The Forms are unexplained. How can an unchanging realm of ideas relate to the changing things we see? Plato’s own dialogue Parmenides raises this, including the “Third Man” regress.', r: 'Plato leaves open how things “participate” in the Forms; the later dialogues revise the theory. Defenders say that a hard problem is not a refuted one, since every metaphysics has a gap at its foundation.', c: 'Critics reply that if the relation cannot be explained, the Forms do not explain much.' },
          { o: 'Aristotle: the real structure of things is found in the things, not in a separate world. We learn about it through experience, not by turning away from it.', r: 'A Platonist might answer that experience alone never yields necessary truths such as those of mathematics, so something beyond experience is needed.', c: 'Empiricists reply that mathematical knowledge may be explained by abstraction or convention without a separate realm.' },
          { o: 'How does the freed prisoner know the sunlit world is the last one? There might be a larger cave outside. Descartes’ evil demon and modern simulation arguments press the same worry.', r: 'Plato says the ascent ends in understanding what makes everything intelligible, the Form of the Good. Skeptics respond that nothing could prove one has arrived there.', c: 'A moderate answer: we can never be certain, but we can keep correcting ourselves.' },
          { o: 'Political: Popper (The Open Society and Its Enemies, 1945) argued that the philosopher-ruler, who claims to have seen the truth, is a licence for authoritarian rule.', r: 'Defenders say Plato’s rulers rule reluctantly and without wealth or family, and that the Republic is a thought experiment about justice, not a constitution to impose.', c: 'Critics reply that the idea that experts possess final truth about the good life is the dangerous part.' },
          { o: 'Pragmatists such as William James and Richard Rorty: there is no view from nowhere. Truth is what works in practice or what we can justify to each other. The cave’s “outside” is a story, not a place.', r: 'Platonists reply that if truth is only what works, then the prisoners’ shadows, which work very well for predicting shadows, count as knowledge.', c: 'Pragmatists reply that working well across many more tests is exactly what separates the shadows from the sun.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'society', kind: 'modern', title: 'Social media and modern society', blurb: 'Is a feed a cave? What the evidence says, and what Plato’s image still gets right.', mins: 6, nodes: [
        { t: 'scale', q: 'How much of what you know about the wider world reached you through feeds, headlines or search results rather than first-hand?', left: 'Almost none', right: 'Almost all', note: 'Most of what anyone knows is second-hand; that is true of readers of books and newspapers too. The question is how filtered it is, and whether you can see how.' },
        { t: 'read', h: 'The tempting comparison', p: ['Ranked feeds choose what you see, and the choice is shaped by what holds attention. The French theorist Jean Baudrillard (Simulacra and Simulation, 1981) argued that images and signs could replace the things they stand for. Neil Postman (Amusing Ourselves to Death, 1985) argued that television turned public life into entertainment. The cave is the classic image behind both.'] },
        { t: 'read', h: 'What the evidence says', p: ['Eli Pariser popularised the term “filter bubble” in 2011. Research since has been mixed. A large 2015 Facebook study (Bakshy and colleagues) found that individual choices limited cross-cutting exposure more than the ranking algorithm did. In 2023, large experiments on Facebook and Instagram during the 2020 US election found that changing the algorithm or reducing reshared content shifted what people saw, but did not measurably change political attitudes over a few months.', 'So the cave metaphor is stronger on how it feels than on what has been measured. Plato’s deeper point still stands: it is hard to notice the frame you look through.'] },
        { t: 'sort', q: 'Which of these sit closer to the shadow (second-hand, filtered) and which closer to the object (first-hand, checkable)?', buckets: ['Closer to the shadow', 'Closer to the object'], items: [
          { t: 'A cropped screenshot of a quote', b: 0, why: 'Someone chose the crop, so you do not see what was left out.' },
          { t: 'The full original document or recording', b: 1, why: 'You can check context for yourself.' },
          { t: 'A headline written to get clicks', b: 0, why: 'It is a summary designed for attention, not accuracy.' },
          { t: 'Raw data you can download and test', b: 1, why: 'You can repeat the analysis and see the whole.' },
          { t: 'An algorithmically ranked feed', b: 0, why: 'Selection by an unseen process is the shadow-play of the cave.' },
          { t: 'Something you measured or tried yourself', b: 1, why: 'Direct experience, though also fallible and limited.' }
        ] },
        { t: 'read', h: 'The lesson worth taking', p: ['Almost everything we know is second-hand, and that is fine. Plato’s cave is not a warning to avoid shadows. It is a challenge to notice what you are looking at, who is carrying the objects, and where the fire is.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'confidence'] }
      ] }
    ]
  });

  /* ============ HISTORY: the republic ============ */
  C.HOLES.push({
    id: 'republic-falls', anchor: 'crossing-the-rubicon', topic: 'history', title: 'How a Republic Falls',
    hook: 'A small river in 49 BCE is the famous moment. The real story is the long erosion before it.',
    claim: 'Republics fall because of a single decisive act rather than a long erosion of norms.',
    anti: 'Republics fall slowly, through many small breaches that make the final one possible.',
    themes: ['power', 'change'], related: ['justice-behind-veil', 'plato-cave'],
    paths: [
      { id: 'story', kind: 'origin', title: 'The long road to the Rubicon', blurb: 'From the Gracchi and Sulla to Caesar, a century of broken precedents.', mins: 5, nodes: [
        { t: 'read', h: 'A machine built for a city', p: ['Rome’s republic balanced annual magistrates (consuls), a Senate of ex-magistrates, and popular assemblies with tribunes who could veto. It was designed for a city-state, and Rome had become an empire.'] },
        { t: 'read', h: 'The precedents fall', p: ['In 133 BCE, Tiberius Gracchus’s land bill ended in his death at the hands of senators, a break with the rule that politics was settled without killing citizens. In 107 BCE Gaius Marius was elected consul and soon enrolled landless men into the army; they came to depend on their general, not the state, for rewards.', 'In 88 BCE Sulla marched legions on Rome itself, the first time a Roman general did so, and in 82 BCE made himself dictator, before resigning in 79. Caesar’s crossing in 49 BCE broke a taboo that had already been broken.'] },
        { t: 'choice', q: 'Which Roman general first marched an army on the city of Rome?', ans: 2, opts: [['Julius Caesar', 'Caesar did it in 49 BCE, but he was not the first.'], ['Pompey', 'Pompey was a rival and a dictator’s protégé, but not the first.'], ['Sulla', 'Right. He did it in 88 BCE and again in 82 BCE.']], why: 'Sulla did it in 88 BCE. Caesar’s crossing was a repeat of a recent wound.' },
        { t: 'read', h: 'After the crossing', p: ['Caesar defeated Pompey, became dictator, and was assassinated on 15 March 44 BCE by senators who hoped to restore the republic. It did not work: civil war followed, and Octavian (Augustus) emerged as sole ruler. In 27 BCE he formally “restored” the republic while holding the real power, and called himself princeps, “first citizen.”'] },
        { t: 'mirror', n: 2, kinds: ['assume', 'evidence'] }
      ] },
      { id: 'what-if', kind: 'play', title: 'Pull a lever', blurb: 'Which single change would most plausibly have saved the republic? Test your answer.', mins: 4, nodes: [
        { t: 'choice', q: 'If you could change one thing in the late republic, which would most likely have saved it?', opts: [['Make the Senate compromise with Caesar in 50 BCE', 'It might have bought time. But the structural problem remained: commanders with loyal armies and nothing to restrain them but custom.'], ['Have Caesar disband his army and face trial', 'Possible. But his rivals’ hostility made many, including Caesar, fear that a trial was a path to ruin. Trust, not law, was missing.'], ['Fix how veterans were paid so armies were loyal to the state', 'Many historians see this as the heart of it. Land for veterans had to be won by generals, which tied soldiers to commanders.'], ['Reduce the inequality between rich senators and ordinary citizens', 'Land and debt crises fed the Gracchan conflict. A deeper fix, but very hard to carry out through a senate of landowners.'], ['Nothing. Empire was probably inevitable', 'Some historians argue that governing a huge empire with city-state institutions could not last. Others argue that individual choices mattered a great deal.']] },
        { t: 'read', h: 'The debate', p: ['Ancient and modern historians still argue about how far the republic’s fall was structural and how far contingent. Sallust blamed moral decline after Carthage’s defeat. Syme (The Roman Revolution, 1939) emphasised factions of powerful families. Millar and others stressed the people’s role. Your answer is a position in a live debate.'] },
        { t: 'mirror', n: 2, kinds: ['opposite', 'confidence'] }
      ] },
      { id: 'compare', kind: 'compare', title: 'Rome and later republics', blurb: 'What analogies illuminate, and where they mislead.', mins: 5, nodes: [
        { t: 'compare', h: 'A cautious comparison', cols: [{ h: 'Late Roman Republic', pts: ['Armies loyal to commanders, not the state.', 'Political violence repeatedly went unpunished.', 'Emergency powers used to bypass the normal rules.', 'Few citizens could vote in Rome itself; the city’s institutions did not scale.'] }, { h: 'Modern constitutional democracies', pts: ['Armies are professional and subordinate to civilian control.', 'Courts, a free press, and mass voting give other checks.', 'Political scientists such as Levitsky and Ziblatt (2018) stress “mutual toleration” and “forbearance” as unwritten norms.', 'Democracies can erode slowly through legal steps as well as break suddenly.'] }], q: 'What is the most important difference between the two?', note: 'Historical analogies tempt us to see our own moment in an old one. Good use of Rome asks what is different as much as what is similar.' },
        { t: 'mirror', n: 1, kinds: ['assume'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Was the republic already dead?', blurb: 'Three objections to the story that Caesar “killed” it.', mins: 5, nodes: [
        { t: 'ladder', h: 'Three objections', claim: 'Caesar destroyed the Roman republic.', rungs: [
          { o: 'The republic was already broken by Sulla’s march, the proscriptions and decades of violence. Caesar was a symptom.', r: 'Yes, though a patient who is ill can still die from a particular blow. Caesar’s victory ended the competitive politics that made the republic work.', c: 'Whether the earlier decline was fatal is the heart of the debate.' },
          { o: 'The “republic” was an oligarchy. Cato and the Senate defended the privileges of a few families, not liberty for the many.', r: 'Fair as a description. But the republic did give citizens courts, assemblies and law that limited rulers, which a monarchy of any kind removes.', c: 'Whether those limits were meaningful for most people is argued.' },
          { o: 'Caesar’s reforms were sensible (calendar, debt relief, citizenship for provincials). A strong ruler was what a vast empire needed.', r: 'Many of the reforms were useful. The objection is to how power was taken and held. Those who accept this argument have to explain why the same reasoning would not justify any strongman who is sure he is right.', c: 'Some see the empire as an adaptation. Others see it as a loss of freedom with a few benefits.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'norms', kind: 'modern', title: 'Norms, kept and broken', blurb: 'Sort real Roman episodes by whether a norm was kept or broken.', mins: 4, nodes: [
        { t: 'sort', q: 'Norm kept, or norm broken?', buckets: ['Norm kept', 'Norm broken'], items: [
          { t: 'Cincinnatus resigns the dictatorship after a few weeks (traditionally 458 BCE)', b: 0, why: 'A dictator gives up absolute power voluntarily. The Romans remembered it as the ideal.' },
          { t: 'Sulla marches legions into Rome (88 BCE)', b: 1, why: 'A magistrate with an army entering the city was forbidden by custom.' },
          { t: 'Tiberius Gracchus has fellow tribune Octavius removed from office (133 BCE)', b: 1, why: 'Tribunes were supposed to be inviolable and could veto each other.' },
          { t: 'Sulla resigns the dictatorship (79 BCE)', b: 0, why: 'A rare case of a man with real power stepping down, though after reshaping the constitution.' },
          { t: 'Cicero’s speeches in the Senate defending order against Catiline (63 BCE)', b: 0, why: 'He used the legal procedures and public debate, though the executions of conspirators without trial were later challenged.' }
        ] },
        { t: 'read', h: 'Why this is hard to see at the time', p: ['Every break had defenders: necessity, self-defence, popular will. Norms rarely collapse in one step. Each breach makes the next easier to justify, which is why historians read the whole run rather than any single event.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'confidence'] }
      ] }
    ]
  });

  /* ============ RELIGION: the Euthyphro dilemma ============ */
  C.HOLES.push({
    id: 'divine-goodness', anchor: 'euthyphro-dilemma', topic: 'religion', title: 'Does God Make Things Good?',
    hook: 'A conversation outside an Athenian courthouse became the oldest test for any view of ethics and religion.',
    claim: 'Something is good because God commands it, not the other way around.',
    anti: 'God commands what is good because it is good already, independent of God’s command.',
    themes: ['meaning', 'justice'], related: ['good-life-machine', 'control-hole'],
    paths: [
      { id: 'original', kind: 'origin', title: 'The original dialogue', blurb: 'Plato’s Euthyphro, set weeks before Socrates’s trial.', mins: 4, nodes: [
        { t: 'read', h: 'The scene', p: ['Plato’s Euthyphro is set in 399 BCE outside the porch of the king archon in Athens. Socrates has been charged with impiety and corrupting the young. Euthyphro, a self-assured religious expert, is there to prosecute his own father for the death of a laborer. Socrates asks him what piety is.'] },
        { t: 'read', h: 'The question', p: ['Euthyphro offers: the pious is what is loved by the gods. Socrates asks: is the pious loved by the gods because it is pious, or is it pious because the gods love it? The two options pull in different directions, and Euthyphro cannot settle which to accept. The dialogue ends without a definition.'] },
        { t: 'choice', q: 'The first horn says the gods love the pious because it is pious. What does that imply?', ans: 1, opts: [['Goodness depends on the gods’ preferences', 'That is the second horn.'], ['Goodness is independent of the gods’ will, and the gods respond to it', 'Right. If that is true, then the standard of goodness exists apart from them.'], ['The gods do not love anything', 'Not implied.']], why: 'Right. On this horn, goodness stands on its own and the gods recognise it.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'origin'] }
      ] },
      { id: 'build', kind: 'play', title: 'Build your answer', blurb: 'Choose a horn, then find out what you are now committed to.', mins: 5, nodes: [
        { t: 'choice', q: 'Which horn do you take?', opts: [['Things are good because God commands them (voluntarism)', 'The cost: it seems to make morality arbitrary. If God commanded cruelty, cruelty would be good. Medieval thinkers such as William of Ockham accepted something like this; defenders say a good God would not command cruelty.'], ['God commands things because they are good (independence)', 'The cost: goodness seems to exist outside God, so God is not the ultimate source of morality. Leibniz held this view: God chooses the best because it is best.'], ['Neither. Goodness is part of God’s own nature', 'This is the “third way” of Aquinas and, in modern form, Robert Adams. The cost: critics ask whether this just restates the problem, or makes “God is good” a mere definition.']] },
        { t: 'choice', q: 'Suppose a text commands something that seems deeply wrong. What is the strongest reply on your view?', opts: [['Obey. The command shows what is good', 'Kierkegaard’s Fear and Trembling explores this with Abraham and Isaac, calling it a “teleological suspension of the ethical.” Many readers find the idea hard to accept.'], ['Re-read it. A good God would not command it, so I have misunderstood', 'This appeals to an independent standard of goodness. It keeps morality from being arbitrary, but means conscience is judging scripture.'], ['The command is not binding. It reflects the time it was written', 'Many modern believers read some commands historically. The cost is deciding which commands are which, and by what standard.']] },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'islam', kind: 'compare', title: 'The same question in Islamic thought', blurb: 'Ash’arites and Mu’tazilites argued the Euthyphro problem for centuries.', mins: 5, nodes: [
        { t: 'read', h: 'An old debate in a new language', p: ['In ninth- and tenth-century Baghdad, theologians debated whether human reason can know good and evil without revelation. The question is the Euthyphro dilemma under other names.'] },
        { t: 'compare', cols: [{ h: 'Mu’tazilites', pts: ['Reason can discover that justice is good and injustice is evil.', 'God does not do evil; God acts justly because justice is good.', 'Humans are free and therefore responsible.'] }, { h: 'Ash’arites (after al-Ash’ari, d. 936)', pts: ['Good and evil are what God commands and forbids.', 'God’s will cannot be bound by any standard outside Himself.', 'Emphasises divine omnipotence and the limits of reason.'] }], q: 'Which view of divine justice seems more convincing to you?', note: 'The Ash’arite position became the dominant one in Sunni theology, though with considerable variety, and the Mu’tazilite emphasis on reason influenced later philosophers. Christian and Jewish thinkers had parallel debates.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Pressing the third way', blurb: 'If goodness is God’s nature, three objections follow.', mins: 5, nodes: [
        { t: 'ladder', h: 'Three objections', claim: 'Goodness is grounded in God’s nature, so neither horn of the dilemma applies.', rungs: [
          { o: 'It is just the first horn in disguise. If God’s nature is good, there must be a standard by which we call it good.', r: 'Adams replies that goodness is resemblance to God, in the way that the standard metre was once a physical bar. The standard is God, not something outside.', c: 'Critics reply that a bar can be accurate or inaccurate only relative to a concept of length.' },
          { o: 'If God’s nature is the standard, “God is good” becomes trivially true, and praising God’s goodness says nothing.', r: 'Proponents say the claim is substantive: it says that the one who created and sustains everything is loving, just and merciful, which could have been otherwise.', c: 'The point remains debated.' },
          { o: 'Even granting it, we have to know what God’s nature is. That seems to need independent moral judgment.', r: 'Revelation, tradition and the community of believers may help. But in practice every reader uses conscience to interpret the text.', c: 'This makes the dilemma a practical issue even for the committed.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'secular', kind: 'modern', title: 'Ethics without a lawgiver', blurb: 'If no god grounds morality, what does? Five serious answers.', mins: 5, nodes: [
        { t: 'choice', q: 'If morality is not grounded in God, what might ground it?', opts: [['Human flourishing (Aristotle, Nussbaum)', 'Goods are those that let humans live well. Critics ask who decides what counts as flourishing, and whether it is the same for everyone.'], ['Reason (Kant)', 'Moral laws are those you could will for everyone. Critics ask whether reason alone can supply content, and what to do when duties collide.'], ['Agreement (contractualism)', 'Right acts are those justifiable to everyone affected. Critics worry about those who cannot take part in the bargain, such as animals and future people.'], ['Our moral emotions and evolution', 'Our values arose from living in groups. Hume saw sentiment as the root. Critics say how things evolved does not tell us how they ought to be.'], ['Nothing. Morality is a human invention (error theory, relativism)', 'Mackie argued moral claims are systematically false; others say they are conventions. Most people find it hard to live consistently by that view.']] },
        { t: 'read', h: 'One more observation', p: ['Surveys of philosophers (the 2020 PhilPapers survey) find that most accept or lean toward moral realism, and most are atheists or agnostic. This suggests that many serious thinkers believe morality has some firm basis without a lawgiver. It does not settle the question, since philosophers disagree about what that basis is.'] },
        { t: 'mirror', n: 2, kinds: ['origin', 'confidence'] }
      ] }
    ]
  });

  /* ============ LITERATURE: Ozymandias ============ */
  C.HOLES.push({
    id: 'ozymandias-hole', anchor: 'lit-ozymandias', topic: 'literature', title: 'Ozymandias: Fourteen Lines on Forgetting',
    hook: 'A broken statue in the desert, passed through five voices before it reaches you.',
    claim: 'The poem shows that power is brief and art is what lasts.',
    anti: 'The poem shows that all human works, including art, are lost in time.',
    themes: ['beauty', 'change'], related: ['maps-lie', 'plato-cave'],
    paths: [
      { id: 'sources', kind: 'origin', title: 'The real king and the real statue', blurb: 'Ramesses II, Diodorus, and a friendly rivalry.', mins: 4, nodes: [
        { t: 'read', h: 'Who was Ozymandias?', p: ['Ozymandias is the Greek form of the throne name of Ramesses II, who ruled Egypt for about sixty-six years in the thirteenth century BCE. The first-century BCE Greek historian Diodorus Siculus describes a colossal statue of a king he calls Osymandyas, and reports an inscription in which the king boasts of his greatness and invites anyone who wants to know how great he is to surpass his works.'] },
        { t: 'read', h: 'A competition', p: ['Percy Bysshe Shelley wrote his sonnet in December 1817, reportedly in friendly competition with his friend Horace Smith, who wrote on the same subject. Shelley’s poem was published in The Examiner on 11 January 1818; Smith’s followed on 1 February. In those years Europeans were fascinated with Egypt; a colossal granite bust of Ramesses II was removed from Thebes in 1816 for the British Museum.'] },
        { t: 'choice', q: 'Who is the historical king behind Shelley’s Ozymandias?', ans: 2, opts: [['Tutankhamun', 'He was far less powerful, and his tomb was found in 1922.'], ['Akhenaten', 'He is known for the religious revolution of the Amarna period.'], ['Ramesses II', 'Right. “Ozymandias” comes from the Greek rendering of his throne name.']], why: 'Right. Ramesses II, called “the Great.”' },
        { t: 'mirror', n: 1, kinds: ['assume'] }
      ] },
      { id: 'voices', kind: 'play', title: 'Count the voices', blurb: 'How many people stand between you and the king’s words?', mins: 4, nodes: [
        { t: 'read', h: 'A story told through others', p: ['The poem is a frame narrative. A speaker meets “a traveller from an antique land,” who describes the statue. The statue’s face still shows a sneer. The traveller says the sculptor read the king’s passions, and these survive the hand that mocked them and the heart that fed them.'] },
        { t: 'choice', q: 'Order of transmission: the king’s boast reaches you through how many voices?', ans: 2, opts: [['Two: the king and Shelley', 'Too few. Many hands intervene.'], ['Three: the king, the traveller, and Shelley', 'Close, but one is missing.'], ['Five: the king, the sculptor’s carving, the traveller, the speaker and Shelley as writer', 'Yes, roughly. And then the reader. Each stage can distort the original. The inscription survives only because someone copied it.']], why: 'Five or more, depending on how you count. By the time you hear him, the king’s boast has been interpreted by a sculptor, a traveller, a narrator and a poet.' },
        { t: 'choice', q: 'The poem reads “The hand that mocked them and the heart that fed.” Whose hand is it, most plausibly?', ans: 0, opts: [['The sculptor’s hand, which mocked (imitated) the king’s passions in stone', 'Right, and this is why many readers find it more than a poem about a fallen tyrant: the sculptor’s art survives the king.'], ['Ozymandias’s hand mocking his subjects', 'Possible, and some readers take it that way. The word “mocked” can mean either “imitated” or “ridiculed.”'], ['The traveller’s hand', 'No, the traveller is only reporting.']], why: 'Most readers take it as the sculptor’s hand: the king’s expression survives in the stone. The ambiguity of “mocked” (imitated or ridiculed) lets both readings stand.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'smith', kind: 'compare', title: 'Two poems, one statue', blurb: 'Shelley’s sonnet beside Horace Smith’s answer.', mins: 4, nodes: [
        { t: 'compare', h: 'Same subject, different arcs', cols: [{ h: 'Shelley’s “Ozymandias”', pts: ['Focuses on a single ruined statue in an empty desert.', 'Irony: the boast “Look on my works, ye Mighty, and despair!” faces nothing.', 'Ends with the desert, vast and bare.'] }, { h: 'Horace Smith’s sonnet', pts: ['Also describes the colossal ruin in the desert.', 'Turns to imagine a future traveller finding London in ruins.', 'Makes the warning explicit and personal to his own city.'] }], q: 'Which ending is more powerful for you: the quiet desert, or the imagined ruin of a modern city?', note: 'Smith’s sonnet is usually studied beside Shelley’s because the two were composed together. Most readers find Shelley’s restraint more haunting, but taste differs.' },
        { t: 'mirror', n: 1, kinds: ['evidence'] }
      ] },
      { id: 'readings', kind: 'objections', title: 'Is it about power, or about art?', blurb: 'Four readings of a short poem, and what each leaves out.', mins: 5, nodes: [
        { t: 'ladder', h: 'Four readings', claim: 'Ozymandias is a poem about the fall of tyrants.', rungs: [
          { o: 'It is also about the sculptor. The art survives while the empire does not, so the poem is a defence of art.', r: 'This reading takes “mocked” as “imitated.” Against it: the sculpture too is broken, and only a fragment remains.', c: 'Both readings might be intended: art outlasts power, but only barely.' },
          { o: 'It is political: Shelley, a radical, aimed at the monarchs of his own day, including those restored after Napoleon.', r: 'Plausible given his politics and other poems. But the poem never names any contemporary ruler, which gives it its lasting reach.', c: 'Readers who stress history see a political poem; readers who stress form see a poem about time.' },
          { o: 'It is about the unreliability of stories: we hear it third-hand, and the monument lies.', r: 'The frame narrative supports this. But the poem’s final image of desolation is not at all unreliable.', c: 'It may be that the poem is clear about what happened and unclear about how we know it.' },
          { o: 'It is not about anything beyond itself: a well-made sonnet on a subject of its day.', r: 'A formalist might agree that the poem’s power comes from structure: the turn after line eight, the contrast of grand inscription and empty sand.', c: 'Most people think a poem can be both well made and about something.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'forgetting', kind: 'modern', title: 'What do we build to be remembered?', blurb: 'From stone to servers: how well do our monuments last?', mins: 4, nodes: [
        { t: 'scale', q: 'How confident are you that the things you create online will still be accessible in twenty years?', left: 'Not at all', right: 'Completely', note: 'A 2024 Pew Research Center analysis found that 38% of webpages that existed in 2013 were no longer accessible a decade later. Stone is slow to vanish; links are not.' },
        { t: 'read', h: 'Fragile and durable', p: ['Clay tablets and carved stone, the oldest records we have, survive in huge numbers, while many digital formats from only a few decades ago are already hard to read. Librarians call the problem “digital preservation.” The poem’s irony works in reverse: the statue boasts of permanence and is broken, yet we know of it because someone wrote it down.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'confidence'] }
      ] }
    ]
  });
})();
