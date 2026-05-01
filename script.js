const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");
const btn = document.querySelector(".btn");

const toggleBtn = document.querySelector(".toggleBtn");

    toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("ai");

    autoPlay = !autoPlay; 
    if (!autoPlay) {
        direction = 1;
    }
});



const size = 20;
let cells = [];
let snake = [202, 201, 200];
let direction = 1;
let food = 150;
let score = 0;
let interval = null;
let currentAlgorithm = "bfs";
let autoPlay = true;


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
    if(autoPlay){
        autoMove();
    }
    move();
    draw();
}

document.addEventListener("keydown", (e) => {
if (autoPlay) return;

    if (e.key === "ArrowRight") direction = 1;
    if (e.key === "ArrowLeft") direction = -1;
    if (e.key === "ArrowUp") direction = -size;
    if (e.key === "ArrowDown") direction = size;
});


function getNeighbors(pos){
    const neighbors = [];
    const moves = [1, -1, size, -size];
    for(let move of moves){
        const next = pos + move;
        if(
            next >= 0 &&
            next < size * size &&
            !snake.includes(next)
        ){

            if(move === 1 && pos % size === size - 1) continue;
            if(move === -1 && pos % size === 0) continue;
            neighbors.push(next);
        }
    }

    return neighbors;
}



function manhattan(pos){
    const x1 = pos % size;
    const y1 = Math.floor(pos / size);
    const x2 = food % size;
    const y2 = Math.floor(food / size);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}



function bfs(start){
    let queue = [[start, []]];
    let visited = new Set();
    while(queue.length){
        let [state, path] = queue.shift();
        if(state === food){
            return path;
        }
        if(visited.has(state)) continue;
        visited.add(state);
        for(let n of getNeighbors(state)){
            queue.push([n, [...path, n]]);
        }
    }

    return [];
}



function dfs(start){
    let stack = [[start, []]];
    let visited = new Set();
    while(stack.length){
        let [state, path] = stack.pop();
        if(state === food){
            return path;
        }
        if(visited.has(state)) continue;
        visited.add(state);
        for(let n of getNeighbors(state)){
            stack.push([n, [...path, n]]);
        }
    }

    return [];
}



function uniform(start){
    let queue = [[0, start, []]];
    let visited = new Set();
    while(queue.length){
        queue.sort((a,b) => a[0] - b[0]);
        let [cost, state, path] = queue.shift();
        if(state === food){
            return path;
        }
        if(visited.has(state)) continue;
        visited.add(state);
        for(let n of getNeighbors(state)){
            queue.push([cost + 1, n, [...path, n]]);
        }
    }

    return [];
}


function greedy(start){
    let heap = [[manhattan(start), start, []]];
    let visited = new Set();
    while(heap.length){
        heap.sort((a,b) => a[0] - b[0]);
        let [h, state, path] = heap.shift();
        if(state === food){
            return path;
        }
        if(visited.has(state)) continue;
        visited.add(state);
        for(let n of getNeighbors(state)){
            heap.push([manhattan(n), n, [...path, n]]);
        }
    }

    return [];
}


function astar(start){
    let heap = [[manhattan(start), 0, start, []]];
    let visited = new Set();
    while(heap.length){
        heap.sort((a,b) => a[0] - b[0]);
        let [f, g, state, path] = heap.shift();
        if(state === food){
            return path;
        }
        if(visited.has(state)) continue;
        visited.add(state);
        for(let n of getNeighbors(state)){
            let newG = g + 1;
            let newF = newG + manhattan(n);
            heap.push([newF, newG, n, [...path, n]]);
        }
    }

    return [];
}


function autoMove(){
    let path = [];
    if(currentAlgorithm === "bfs"){
        path = bfs(snake[0]);
    }
    if(currentAlgorithm === "dfs"){
        path = dfs(snake[0]);
    }
    if(currentAlgorithm === "ucs"){
        path = uniform(snake[0]);
    }
    if(currentAlgorithm === "greedy"){
        path = greedy(snake[0]);
    }
    if(currentAlgorithm === "astar"){
        path = astar(snake[0]);
    }
    if(path.length > 0){
        const next = path[0];
        direction = next - snake[0];
    }
}


document.getElementById("bfsBtn").onclick = () => {
    currentAlgorithm = "bfs";
};
document.getElementById("dfsBtn").onclick = () => {
    currentAlgorithm = "dfs";
};
document.getElementById("ucsBtn").onclick = () => {
    currentAlgorithm = "ucs";
};
document.getElementById("greedyBtn").onclick = () => {
    currentAlgorithm = "greedy";
};
document.getElementById("astarBtn").onclick = () => {
    currentAlgorithm = "astar";
};                  


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