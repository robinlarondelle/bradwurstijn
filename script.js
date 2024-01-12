
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
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', endDrag);

let dragEnabled = false;
let initialX;
let initialPlayerX;

function startDrag(e) {
    dragEnabled = true;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

    // Record the initial position of the mouse or touch
    initialX = clientX;

    // Record the initial left position of the player
    initialPlayerX = player.getBoundingClientRect().left - gameContainer.getBoundingClientRect().left;
}

function drag(e) {
    if (!dragEnabled) return;
    e.preventDefault();

    // Get the current mouse or touch position
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;

    // Calculate the new position of the player
    let newLeft = initialPlayerX + (clientX - initialX) + player.offsetWidth / 2;

    // Adjusting newLeft to ensure player stays within 20 pixels of the borders
    newLeft = Math.max(newLeft, (player.offsetWidth / 2) + 20); // Ensures not going too left
    newLeft = Math.min(newLeft, gameContainer.offsetWidth - (player.offsetWidth / 2) - 20); // Ensures not going too right

    // Update the player's position
    player.style.left = newLeft + 'px';
}

function endDrag() {
    dragEnabled = false;
}

// Refined Collision Detection
function isCaught(sausage) {
    const sausageRect = sausage.getBoundingClientRect();
    const jawRect = document.getElementById('player-jaw').getBoundingClientRect();
    const isNear = sausageRect.bottom > jawRect.top - 50; // 50 pixels threshold for jaw opening
    if (isNear) {
        document.getElementById('player-jaw').classList.add('jaw-open');
    }
    return sausageRect.bottom > jawRect.top &&
           sausageRect.right > jawRect.left &&
           sausageRect.left < jawRect.right;
}

// Balanced Difficulty Scaling
function difficultyScaling() {
    // spawn rate should be random between 500 and 2000, but should be faster as the score increases
    let spawnRate = 2000 - Math.min(Math.floor(score / 2) * 400, 1500);

    
    
    // fall speed should be random between 5 and 10, but should be faster as the score increases



    // let spawnRate = 2000 - Math.min(Math.floor(score / 2) * 400, 1500);
    // let spawnRate = 1;
    let fallSpeed = 5 + Math.min(Math.floor(score / 5), 5);
    return { spawnRate, fallSpeed };
}

function spawnSausage(fallSpeed) {
    if (isGameOver) return;
    const sausage = document.createElement('img');
    sausage.src = 'worst-1.png';
    sausage.classList.add('sausage');
    // Ensure sausages spawn within the bounds of the game container
    sausage.style.left = Math.random() * (gameContainer.offsetWidth - sausage.offsetWidth) + 'px';

    if (sausage.style.left < 20) {
        console.log(sausage.style.left)
        sausage.style.left = 20;
    }

    // if sausage spawns too far to the right of the current width, adjust it to 20ox from the right border
    if (sausage.style.left > gameContainer.offsetWidth - 20) {
        console.log(sausage.style.left)
        sausage.style.left = gameContainer.offsetWidth - 20;
    }

    gameContainer.appendChild(sausage);
    fall(sausage, fallSpeed);
}


function fall(sausage, fallSpeed) {
    let sausageTop = 0;
    const fallInterval = setInterval(() => {
        if (sausageTop >= gameContainer.offsetHeight - 70) {
            clearInterval(fallInterval);
            document.getElementById('player-jaw').classList.remove('jaw-open'); // Close the jaw
            if (isCaught(sausage)) {
                score++;
                scoreDisplay.textContent = 'Score: ' + score;

                // remove the sausage from the DOM
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
    isGameOver = true;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').style.display = 'flex';
}

document.getElementById('restart-button').addEventListener('click', function () {
    location.reload();
});


// Game Loop with Adjusted Difficulty
function gameLoop() {
    const { spawnRate, fallSpeed } = difficultyScaling();
    spawnSausage(fallSpeed);
    setTimeout(gameLoop, spawnRate);
}

gameLoop();
