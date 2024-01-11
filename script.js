
let score = 0;
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
let isGameOver = false;

// Drag functionality
player.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);
player.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', drag, {passive: false});
document.addEventListener('touchend', endDrag);

let dragEnabled = false;
let offsetX;

function startDrag(e) {
    dragEnabled = true;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const playerRect = player.getBoundingClientRect();
    offsetX = clientX - playerRect.left;
}

function drag(e) {
    console.log("dragging")
    if (!dragEnabled) return;
    e.preventDefault();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const gameRect = gameContainer.getBoundingClientRect();
    let newLeft = clientX - gameRect.left - offsetX;
    
    // Constrain the player within the game container
    if (newLeft < 0) newLeft = 0;
    if (newLeft > gameContainer.clientWidth - player.offsetWidth) {
        newLeft = gameContainer.clientWidth - player.offsetWidth;
    }
    player.style.left = newLeft + 'px';
}


function endDrag() {
    dragEnabled = false;
}

// Refined Collision Detection
function isCaught(sausage) {
    const sausageRect = sausage.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    return sausageRect.bottom > playerRect.top &&
           sausageRect.right > playerRect.left &&
           sausageRect.left < playerRect.right;
}

// Balanced Difficulty Scaling
function difficultyScaling() {
    let spawnRate = 2000 - Math.min(Math.floor(score / 5) * 200, 1500);
    let fallSpeed = 5 + Math.min(Math.floor(score / 10), 5);
    return { spawnRate, fallSpeed };
}

function spawnSausage(fallSpeed) {
    if (isGameOver) return;
    const sausage = document.createElement('img');
    sausage.src = 'worst-1.png';    
    sausage.classList.add('sausage');
    // Ensure sausages spawn within the bounds of the game container
    sausage.style.left = Math.random() * (gameContainer.offsetWidth - sausage.offsetWidth) + 'px';
    gameContainer.appendChild(sausage);
    fall(sausage, fallSpeed);
}


function fall(sausage, fallSpeed) {
    let sausageTop = 0;
    const fallInterval = setInterval(() => {
        if (sausageTop >= gameContainer.offsetHeight - 70) {
            clearInterval(fallInterval);
            if (isCaught(sausage)) {
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
                sausage.remove();
            } else {
                gameOver();
            }
        } else {
            sausageTop += fallSpeed; // Falling speed
            sausage.style.top = sausageTop + 'px';
        }
    }, 20); // Falling rate
}

function gameOver() {
    // isGameOver = true;
    // document.getElementById('final-score').textContent = score;
    // document.getElementById('game-over').style.display = 'flex';
}

document.getElementById('restart-button').addEventListener('click', function() {
    location.reload();
});


// Game Loop with Adjusted Difficulty
function gameLoop() {
    const { spawnRate, fallSpeed } = difficultyScaling();
    spawnSausage(fallSpeed);
    setTimeout(gameLoop, spawnRate);
}

gameLoop();
