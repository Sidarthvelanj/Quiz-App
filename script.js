const questions = [
  {
    question: "What is the only mammal that cannot jump?",
    answers: [
      { text: "Whale", correct: false },
      { text: "Eagle", correct: false },
      { text: "Elephant", correct: true },
      { text: "Giraffe", correct: false },
    ]
  },
  {
    question: "Which country has the most number of time zones?",
    answers: [
      { text: "USA", correct: false },
      { text: "China", correct: false },
      { text: "India", correct: false },
      { text: "France", correct: true },
    ]
  },
  {
    question: "Which city is famously known as the Big Apple?",
    answers: [
      { text: "New York", correct: true },
      { text: "Los Angeles", correct: false },
      { text: "Las Vegas", correct: false },
      { text: "Miami", correct: false },
    ]
  },
  {
    question: "Which was the first country to adopt a constitution?",
    answers: [
      { text: "USA", correct: true },
      { text: "India", correct: false },
      { text: "Poland", correct: false },
      { text: "France", correct: false },
    ]
  },
  {
    question: "Which is the largest desert in the world?",
    answers: [
      { text: "Sahara", correct: false },
      { text: "Gobi", correct: false },
      { text: "Kalahari", correct: false },
      { text: "Antarctica", correct: true },
    ]
  },
  {
    question: "Which of the following does NOT relate to hormonal responses in love?",
    answers: [
      { text: "Dopamine", correct: false },
      { text: "Oxytocin", correct: false },
      { text: "Noradrenaline", correct: false },
      { text: "Cortisol", correct: true },
    ]
  },
  {
    question: "Who is the father of Mathematics?",
    answers: [
      { text: "Euclid", correct: false },
      { text: "Pythagoras", correct: false },
      { text: "Archimedes", correct: true },
      { text: "Aristotle", correct: false },
    ]
  },
  {
    question: "What feeling is felt most strongly by humans?",
    answers: [
      { text: "Happiness", correct: false },
      { text: "Sadness", correct: false },
      { text: "Fear", correct: true },
      { text: "Anger", correct: false },
    ]
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Iron", correct: false },
      { text: "Diamond", correct: true },
      { text: "Platinum", correct: false },
    ]
  },
  {
    question: "What is the largest island in the world?",
    answers: [
      { text: "Greenland", correct: true },
      { text: "Antarctica", correct: false },
      { text: "Madagascar", correct: false },
      { text: "Iceland", correct: false },
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("option-container");
const nextButton = document.getElementById("next-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const startBtn = document.getElementById("start-btn");
const timerDisplay = document.getElementById("timer");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timer;
let timeLeft = 8;
let answerSelected = false;

function startQuiz() {
  questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  nextButton.onclick = handleNext;
  questionElement.classList.remove("perfect-score");
  questionElement.innerHTML = "";
  resultScreen.classList.remove("active");
  resultScreen.classList.add("hidden");
  quizScreen.classList.add("active");
  loadQuestion();
}

function loadQuestion() {
  resetState();
  clearInterval(timer);
  timeLeft = 8;
  answerSelected = false;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0 && !answerSelected) {
      clearInterval(timer);
      answerSelected = true;
      handleNext();
    }
  }, 1000);

  const current = questions[currentQuestionIndex];
  questionElement.innerHTML = `${currentQuestionIndex + 1}. ${current.question}`;

  current.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.innerHTML = answer.text;
    if (answer.correct) btn.dataset.correct = true;
    btn.addEventListener("click", () => {
      if (answerSelected) return;
      answerSelected = true;
      clearInterval(timer);
      checkAnswer(btn);
    });
    answerButtons.appendChild(btn);
  });
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
}

function resetState() {
  nextButton.classList.remove("show");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function checkAnswer(button) {
  const isCorrect = button.dataset.correct === "true";
  if (isCorrect) score++;
  button.classList.add(isCorrect ? "correct" : "incorrect");

  Array.from(answerButtons.children).forEach(btn => {
    btn.disabled = true;
    btn.classList.add("locked");
    if (btn.dataset.correct === "true") btn.classList.add("correct");
  });

  nextButton.classList.add("show");
}

function handleNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  resetState();
  clearInterval(timer);
  quizScreen.classList.remove("active");

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  resultText.innerHTML = `
    You scored ${score} out of ${questions.length}!<br>
    High Score: ${highScore}
  `;

  if (score === questions.length) {
    resultText.classList.add("perfect-score");
  } else {
    resultText.classList.remove("perfect-score");
  }

  resultScreen.classList.remove("hidden");
  void resultScreen.offsetWidth; // force reflow
  resultScreen.classList.add("active");
}

restartBtn.addEventListener("click", () => {
  resultScreen.classList.remove("active");
  resultScreen.classList.add("hidden");
  quizScreen.classList.add("active");
  startQuiz();
});

window.addEventListener("DOMContentLoaded", () => {
  welcomeScreen.style.display = "block";
  quizScreen.classList.remove("active");
});
startBtn.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    quizScreen.classList.add("active");
    startQuiz();
  });