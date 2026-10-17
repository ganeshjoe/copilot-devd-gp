// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns a new quiz state with questions in a random order.
 */
function createQuiz(questions) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  return {
    questions: shuffle(safeQuestions),
    current: 0,
    score: 0,
    timeLeft: 15,
    timerId: null,
    answerLocked: false,
  };
}

/**
 * Advances the quiz state after an answer selection.
 * Returns a new state object without mutating the input state.
 */
function answerQuestion(state, selectedIndex) {
  const currentQuestion = state.questions[state.current];
  const correct = isCorrect(currentQuestion, selectedIndex);

  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answerLocked: true,
    },
    correct,
  };
}

/**
 * Returns true when there are no questions left to show.
 */
function isQuizFinished(state) {
  return Number.isInteger(state?.current) && Array.isArray(state?.questions) && state.current >= state.questions.length;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Returns true when the current percentage is a new best score.
 * A null or missing best score counts as a new record.
 */
function isNewBestScore(current, best) {
  const safeCurrent = Number(current);
  const safeBest = Number(best);

  if (!Number.isFinite(safeCurrent)) {
    return false;
  }

  if (best === null || best === undefined || !Number.isFinite(safeBest)) {
    return true;
  }

  return safeCurrent > safeBest;
}

/**
 * Formats the remaining time for the question timer.
 */
function formatTimeLeft(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  return `⏱ ${safeSeconds}s`;
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns a supportive message for the given grade.
 */
function getFeedbackMessage(grade) {
  const normalizedGrade = String(grade ?? "").toUpperCase();
  if (normalizedGrade === "A") return "Excellent work!";
  if (normalizedGrade === "B") return "Great job!";
  if (normalizedGrade === "C") return "Nice effort!";
  return "Keep practicing!";
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    calculatePercentage,
    formatTimeLeft,
    getGrade,
    getFeedbackMessage,
    createQuiz,
    answerQuestion,
    isQuizFinished,
    isNewBestScore,
  };
}
