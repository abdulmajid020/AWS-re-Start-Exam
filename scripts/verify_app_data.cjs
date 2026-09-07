const fs = require('fs');
const path = require('path');

const rawQuizData = require('../src/data/rawQuizData.json');
const ccp400Data = require('../src/data/ccp400QuizData.json');

console.log('=== VERIFYING APPLICATION QUESTION DATA ===');
console.log('re/Start KCs count:', rawQuizData.knowledge_checks.length);
console.log('CCP 400 Questions count:', ccp400Data.questions.length);
console.log('CCP 400 Practice Sets count:', ccp400Data.practice_sets.length);

let totalReStartQuestions = 0;
rawQuizData.knowledge_checks.forEach(kc => {
  totalReStartQuestions += (kc.questions || []).length;
});
console.log('re/Start Questions count:', totalReStartQuestions);
console.log('Master Total Questions:', totalReStartQuestions + ccp400Data.questions.length);

// Verify multi-select questions
const multiSelectCCP = ccp400Data.questions.filter(q => q.isMultiSelect);
console.log('Multi-Select Questions in CCP 400:', multiSelectCCP.length);

let errors = [];
ccp400Data.questions.forEach(q => {
  if (!q.id || !q.question || !q.options || q.options.length < 2) {
    errors.push(`Invalid question structure: Q${q.questionNumber}`);
  }
  if (!q.explanation || q.explanation.length < 10) {
    errors.push(`Missing or short explanation for Q${q.questionNumber}`);
  }
  if (!q.category) {
    errors.push(`Missing category for Q${q.questionNumber}`);
  }
  if (!q.correctAnswers || q.correctAnswers.length === 0) {
    errors.push(`Missing correctAnswers for Q${q.questionNumber}`);
  }
});

if (errors.length === 0) {
  console.log('✓ All 400 CCP questions passed validation successfully!');
} else {
  console.error(`Found ${errors.length} validation errors:`, errors.slice(0, 5));
  process.exit(1);
}
