/* New anchor experiences that open Rabbit Holes. Same schema as every other experience. */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.library = C.library || [];
  C.library.push({
    id: 'allegory-of-the-cave', type: 'thought', topic: 'philosophy', diff: 1, mins: 3,
    title: 'The Cave and the Shadows',
    hook: 'Imagine a life spent facing a wall, taking its shadows for the whole of reality. Then someone turns you around.',
    links: ['psychology', 'society', 'literature'], thinkers: ['Plato', 'Socrates'],
    scenario: 'In Plato’s Republic, Socrates describes prisoners chained since childhood in an underground cave, able to look only at a wall. Behind them a fire burns, and people carry objects along a walkway so that their shadows fall on the wall. The prisoners name the shadows and honour whoever predicts them best. One prisoner is freed and dragged up into the sunlight. Later he returns to the cave to tell the others what he has seen. What do you think the prisoners do?',
    choices: [
      { id: 'listen', label: 'They listen, and some of them follow him up', result: 'A hopeful reading: people can be persuaded by someone who has seen more. Plato is less optimistic. He says the returning man, eyes dazzled and used to light, would see poorly in the dark and look foolish.', lens: 'The Socratic hope is that questions, not commands, can turn a mind toward the light.' },
      { id: 'mock', label: 'They laugh at him and refuse to leave', result: 'Closer to Plato’s own prediction: the prisoners would conclude the journey ruined his sight. People whose status and skills depend on the shadows have good reasons to defend them.', lens: 'Notice how comfort and expertise can turn into reasons to resist a larger view.' },
      { id: 'kill', label: 'They turn on him, perhaps violently', result: 'Plato says that if they could lay hands on the man who tried to free and lead them up, they would kill him. Many readers hear an echo of the trial of Socrates in 399 BCE.', lens: 'The allegory is partly a defence of Socrates, who was condemned by his own city.' },
      { id: 'depends', label: 'It depends on what he shows them and how', result: 'You have moved the question from them to him. How we present an unfamiliar truth matters, and Plato suggests education is less about putting knowledge in than about turning the whole soul toward the right object.', lens: 'Plato calls education a “turning around” of the soul, not an insertion of information.' }
    ],
    lenses: [
      { who: 'Plato', view: 'Used the cave (Republic, Book VII, c. 375 BCE) to illustrate education and the difference between opinion about appearances and knowledge of what is real. The sun stands for the Form of the Good.' },
      { who: 'Aristotle', view: 'Plato’s student rejected separate Forms and held that we find the real structure of things in the things themselves, through experience.' },
      { who: 'René Descartes', view: 'Two thousand years later, asked whether an evil demon could be deceiving all of our senses. The question is the cave in modern dress.' }
    ],
    takeaway: 'The cave asks whether the world as we see it is the whole story, and what it costs to leave a comfortable picture of it.',
    prompt: 'What is a belief you hold mainly because everyone around you holds it?'
  });
})();
