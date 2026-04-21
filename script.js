const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");
const btn = document.querySelector(".btn");

const size = 20;
let cells = [];
let snake = [202, 201, 200];
let direction = 1;
let food = 150;
let score = 0;
let interval = null;


function createBoard() {
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        grid.appendChild(cell);
    }
    cells = document.querySelectorAll(".grid div");
}
createBoard();


function draw() {
    cells.forEach(cell => cell.style.background = "#191b28");

    cells[food].style.background = "#758be1";

    snake.forEach(index => cells[index].style.background = "white");
}

function move() {
    const head = snake[0];
    const newHead = head + direction;

    if (
        newHead < 0 ||
        newHead >= size * size ||
        (direction === 1 && head % size === size - 1) ||
        (direction === -1 && head % size === 0)
    ) {
        return gameOver();
    }

    if (snake.includes(newHead)) {
        return gameOver();
    }

    snake.unshift(newHead);

    
    if (newHead === food) {
        score++;
        scoreDisplay.textContent = score;
        
    scoreDisplay.classList.add("glow");

    setTimeout(() => {
        scoreDisplay.classList.remove("glow");
    }, 300);
        food = Math.floor(Math.random() * size * size);
    } else {
        snake.pop();
    }
}


function gameOver() {
    clearInterval(interval);
    alert("Game Over! Score: " + score);
}


function update() {
    move();
    draw();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") direction = 1;
    if (e.key === "ArrowLeft") direction = -1;
    if (e.key === "ArrowUp") direction = -size;
    if (e.key === "ArrowDown") direction = size;
});


function restartGame() {
    clearInterval(interval);
    snake = [202, 201, 200];
    direction = 1;
    score = 0;
    scoreDisplay.textContent = score;
    food = 150;

    interval = setInterval(update, 150);
}

restartGame();


btn.addEventListener("click", restartGame);