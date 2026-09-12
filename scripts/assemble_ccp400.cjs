const fs = require('fs');
const path = require('path');

const part1 = require('./data_part1.cjs');
const part2 = require('./data_part2.cjs');
const part3 = require('./data_part3.cjs');
const part4 = require('./data_part4.cjs');

const allAnswers = { ...part1, ...part2, ...part3, ...part4 };

const rawQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, '../doc/parsed_questions_raw.json'), 'utf-8'));

console.log(`Loaded ${rawQuestions.length} raw questions.`);
console.log(`Loaded ${Object.keys(allAnswers).length} answer definitions.`);

const finalizedQuestions = [];
const errors = [];

rawQuestions.forEach((q, idx) => {
  const qNum = q.qNumber || (idx + 1);
  const data = allAnswers[qNum];

  if (!data) {
    errors.push(`Missing answer data for question Q${qNum}`);
    return;
  }

  // Map letters (e.g. ['A', 'C']) to option text
  const letterMap = {};
  q.optionLetters.forEach((letter, i) => {
    letterMap[letter.toUpperCase()] = q.options[i];
  });

  const correctAnswers = data.ans.map((letter) => {
    const text = letterMap[letter.toUpperCase()];
    if (!text) {
      errors.push(`Question Q${qNum}: Letter ${letter} does not map to any option in options [${q.optionLetters.join(', ')}]`);
    }
    return text;
  }).filter(Boolean);

  const isMulti = q.isMultiSelect || data.ans.length > 1;
  const reqSelections = q.requiredSelections || data.ans.length;

  if (correctAnswers.length !== data.ans.length) {
    errors.push(`Question Q${qNum}: Mismatch between letter count (${data.ans.length}) and mapped text count (${correctAnswers.length})`);
  }

  const setIndex = Math.ceil(qNum / 30); // Practice Sets of 30 questions each
  const setStartQ = (setIndex - 1) * 30 + 1;
  const setEndQ = Math.min(setIndex * 30, 400);

  const formatted = {
    id: `ccp-q-${qNum}`,
    bankId: 'ccp400',
    questionNumber: qNum,
    kcIndex: setIndex,
    kcId: 700000 + setIndex,
    kcTitle: `CCP 400 - Practice Set ${setIndex} (Q${setStartQ}–Q${setEndQ})`,
    category: data.cat,
    summary: `Official AWS Certified Cloud Practitioner exam practice question covering ${data.cat}.`,
    question: q.question,
    options: q.options,
    correctAnswer: correctAnswers[0] || '',
    correctAnswers: correctAnswers,
    isMultiSelect: isMulti,
    requiredSelections: reqSelections,
    explanation: data.exp
  };

  finalizedQuestions.push(formatted);
});

if (errors.length > 0) {
  console.error('Errors encountered during assembly:');
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
}

console.log(`Successfully assembled ${finalizedQuestions.length} questions!`);

// Group into Practice Sets (30 questions each)
const totalSets = Math.ceil(finalizedQuestions.length / 30);
const practiceSets = [];
for (let s = 1; s <= totalSets; s++) {
  const setQuestions = finalizedQuestions.filter(q => q.kcIndex === s);
  const startQ = (s - 1) * 30 + 1;
  const endQ = Math.min(s * 30, 400);
  practiceSets.push({
    index: s,
    id: 700000 + s,
    title: `CCP 400 - Practice Set ${s}`,
    category: 'Certification Prep',
    summary: `Curated practice assessment of ${setQuestions.length} official AWS CCP exam questions (Q${startQ}–Q${endQ}).`,
    questionCount: setQuestions.length,
    questionIds: setQuestions.map(q => q.id)
  });
}

const finalDataset = {
  course_id: 9900,
  course_name: "AWS Certified Cloud Practitioner (CCP 400 Question Bank)",
  total_questions: finalizedQuestions.length,
  total_practice_sets: practiceSets.length,
  practice_sets: practiceSets,
  questions: finalizedQuestions
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/ccp400QuizData.json'),
  JSON.stringify(finalDataset, null, 2),
  'utf-8'
);

console.log('Saved src/data/ccp400QuizData.json successfully!');
