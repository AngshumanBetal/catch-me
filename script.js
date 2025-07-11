const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const popSound = document.getElementById("pop-sound");

let score = 0;
let timeLeft = 30;

function moveTarget() {
  const x = Math.random() * (window.innerWidth - 50);
  const y = Math.random() * (window.innerHeight - 50);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

function handleClick() {
  score++;
  scoreDisplay.textContent = score;
  popSound.play();
  moveTarget();
}

target.addEventListener("click", handleClick);

// Initial target position
moveTarget();

// Auto move every 2 seconds
const autoMoveInterval = setInterval(moveTarget, 2000);

// Countdown timer
const timerInterval = setInterval(() => {
  timeLeft--;
  timerDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    clearInterval(autoMoveInterval);
    target.removeEventListener("click", handleClick);
    alert(`Time's up! Your final score is ${score}`);
  }
}, 1000);