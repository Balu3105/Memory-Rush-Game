const baseImages = [
    "images/cpp.jpg", "images/dog.jpg", "images/flow.jpg", "images/java.jpg",
    "images/tiger.jpg", "images/tree.jpg", "images/bird.jpg", "images/sun.jpg",
    "images/joker.jpg", "images/rose.jpg", "images/lion.jpg", "images/sea.jpg",
    "images/moon.jpg", "images/star.jpg", "images/flag.jpg", "images/cloud.jpg",
    "images/smile.jpg", "images/rupee.jpg", "images/logo.jpg", "images/red.jpg",
    "images/house.jpg", "images/horse.jpg", "images/five.jpg", "images/gun.jpg",
    "images/arrow.jpg", "images/ball.jpg", "images/bat.jpg", "images/car.jpg",
    "images/google.jpg", "images/lap.jpg", "images/juice.jpg", "images/hack.jpg"
];

let cards = [];
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const overlay = document.getElementById("game-over-overlay");
const finalScore = document.getElementById("final-score");
const difficultySelection = document.getElementById("difficulty-selection");
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timeLeft = 0;
let timer;
let matches = 0;

function startGame(difficulty) {
    difficultySelection.style.display = "none";
    let revealTime;

    switch(difficulty) {
        case 'easy':
            timeLeft = 45;
            gameBoard.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
            cards = generateCards(8);
            revealTime = 2000;
            break;
        case 'medium':
            timeLeft = 90;
            gameBoard.style.gridTemplateColumns = "repeat(6, minmax(0, 1fr))";
            cards = generateCards(18);
            revealTime = 4000;
            break;
        case 'hard':
            timeLeft = 180;
            gameBoard.style.gridTemplateColumns = "repeat(8, minmax(0, 1fr))";
            cards = generateCards(32);
            revealTime = 70000;
            break;
    }

    gameBoard.classList.add("active");
    cards.forEach(createCard);
    revealAllCards();

    setTimeout(() => {
        const allCards = document.querySelectorAll(".card");
        allCards.forEach(card => {
            card.style.backgroundImage = '';
            card.classList.remove("flipped");
        });
        startTimer();
    }, revealTime);
}

function generateCards(pairCount) {
    const selectedImages = baseImages.slice(0, pairCount);
    const cardPairs = [...selectedImages, ...selectedImages];
    return cardPairs.sort(() => 0.5 - Math.random());
}

function startTimer() {
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0 || matches === cards.length / 2) {
            clearInterval(timer);
            showGameOver();
        }
    }, 1000);
}

function revealAllCards() {
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
        card.style.backgroundImage = `url(${card.dataset.value})`;
        card.classList.add("flipped");
    });
}

function showGameOver() {
    finalScore.innerText = `Game Over! Your Score: ${score}`;
    overlay.style.display = "flex";
}

function createCard(value) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.style.backgroundImage = `url(${value})`;
    card.classList.add("flipped");
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

    this.style.backgroundImage = `url(${this.dataset.value})`;
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        score += 10;
        matches++;
        scoreDisplay.innerText = `Score: ${score}`;
        
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            resetBoard();
            
            if (matches === cards.length / 2) {
                clearInterval(timer);
                showGameOver();
            }
        }, 500);
    } else {
        setTimeout(() => {
            firstCard.style.backgroundImage = '';
            secondCard.style.backgroundImage = '';
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}