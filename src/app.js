// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = createQuiz([]);

const BEST_SCORE_KEY = "dev-days-best-score";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const bestScoreText = document.getElementById("best-score-text");
const resultBestText = document.getElementById("result-best-text");
const resultCelebration = document.getElementById("result-celebration");

function getBestScore() {
  try {
    const rawValue = window.localStorage.getItem(BEST_SCORE_KEY);
    if (rawValue === null || rawValue === "") {
      return null;
    }

    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch (error) {
    return null;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    return true;
  } catch (error) {
    return false;
  }
}

function renderBestScoreDisplay() {
  const bestScore = getBestScore();
  const bestText = bestScore === null ? "Best: —" : `Best: ${bestScore}%`;

  if (bestScoreText) {
    bestScoreText.textContent = bestText;
  }

  if (resultBestText) {
    resultBestText.textContent = bestText;
  }
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(state.timeLeft);
  timerText.classList.toggle("timer-warning", state.timeLeft <= 5);
}

function startTimer() {
  stopTimer();
  state.timeLeft = 15;
  updateTimerDisplay();
  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateTimerDisplay();
      stopTimer();
      handleTimeExpired();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function handleTimeExpired() {
  if (state.answerLocked) {
    return;
  }

  state = { ...state, answerLocked: true };
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function startQuiz() {
  stopTimer();
  state = createQuiz(QUESTIONS);
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.current];
  state = { ...state, answerLocked: false };
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";
  startTimer();

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.answerLocked) {
    return;
  }

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  stopTimer();
  buttons.forEach((button) => (button.disabled = true));

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state = { ...state, current: state.current + 1 };
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const previousBest = getBestScore();
  const newBest = isNewBestScore(percentage, previousBest);

  if (newBest) {
    saveBestScore(percentage);
  }

  const bestScore = getBestScore();

  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  resultBestText.textContent = `Best: ${bestScore === null ? "—" : `${bestScore}%`}`;

  if (resultCelebration) {
    resultCelebration.hidden = !newBest;
    resultCelebration.textContent = newBest ? "🎉 New best score!" : "";
  }

  renderBestScoreDisplay();
  showScreen(resultScreen);
}

renderBestScoreDisplay();
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
