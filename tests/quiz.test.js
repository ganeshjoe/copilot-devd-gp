// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
  formatTimeLeft,
  createQuiz,
  answerQuestion,
  isQuizFinished,
  isNewBestScore,
} = require("../src/quiz.js");

test("formatTimeLeft returns a label with the remaining seconds", () => {
  assert.equal(formatTimeLeft(15), "⏱ 15s");
  assert.equal(formatTimeLeft(5), "⏱ 5s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft clamps negative values to zero", () => {
  assert.equal(formatTimeLeft(-3), "⏱ 0s");
});

test("isNewBestScore returns true when there is no previous best", () => {
  assert.equal(isNewBestScore(80, null), true);
});

test("isNewBestScore returns true when the current score exceeds the previous best", () => {
  assert.equal(isNewBestScore(80, 70), true);
});

test("isNewBestScore returns false when the current score matches the previous best", () => {
  assert.equal(isNewBestScore(80, 80), false);
});

test("isNewBestScore returns false when the current score is lower than the previous best", () => {
  assert.equal(isNewBestScore(70, 80), false);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns the right message for an A grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
});

test("getFeedbackMessage returns a fallback message for other grades", () => {
  assert.equal(getFeedbackMessage("D"), "Keep practicing!");
});

test("createQuiz builds a fresh quiz state from the questions", () => {
  const questions = [
    { question: "Q1", options: ["A", "B", "C", "D"], answer: 1 },
    { question: "Q2", options: ["A", "B", "C", "D"], answer: 3 },
  ];

  const state = createQuiz(questions);

  assert.equal(state.current, 0);
  assert.equal(state.score, 0);
  assert.equal(state.timeLeft, 15);
  assert.equal(state.answerLocked, false);
  assert.equal(state.questions.length, 2);
  assert.deepEqual(state.questions.map((q) => q.question).sort(), ["Q1", "Q2"]);
});

test("answerQuestion returns a new state and marks correctness without mutating the input", () => {
  const original = {
    questions: [
      { question: "Q1", options: ["A", "B", "C", "D"], answer: 1 },
      { question: "Q2", options: ["A", "B", "C", "D"], answer: 3 },
    ],
    current: 0,
    score: 0,
    timeLeft: 15,
    timerId: null,
    answerLocked: false,
  };

  const result = answerQuestion(original, 1);

  assert.equal(result.correct, true);
  assert.equal(original.score, 0);
  assert.equal(original.answerLocked, false);
  assert.equal(result.state.score, 1);
  assert.equal(result.state.current, 0);
  assert.notStrictEqual(result.state, original);
  assert.equal(result.state.answerLocked, true);
});

test("isQuizFinished returns true once the last question is reached", () => {
  const doneState = { questions: [{}, {}], current: 2 };
  const activeState = { questions: [{}, {}], current: 1 };

  assert.equal(isQuizFinished(doneState), true);
  assert.equal(isQuizFinished(activeState), false);
});
