
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

    initialX = clientX;
    initialPlayerX = player.getBoundingClientRect().left - gameContainer.getBoundingClientRect().left;
}

function drag(e) {
    if (!dragEnabled) return;
    e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;

    let newLeft = initialPlayerX + (clientX - initialX) + player.offsetWidth / 2;

    newLeft = Math.max(newLeft, (player.offsetWidth / 2)); // Ensures not going too left
    newLeft = Math.min(newLeft, gameContainer.offsetWidth - (player.offsetWidth / 2)); // Ensures not going too right

    player.style.left = newLeft + 'px';
}

function endDrag() {
    dragEnabled = false;
}

function difficultyScaling() {
    let spawnRate = 2000 - Math.min(Math.floor(score / 2) * 400, 1500);
    let fallSpeed = 5 + Math.min(Math.floor(score / 5), 5);
    return { spawnRate, fallSpeed };
}

function spawnSausage(fallSpeed) {
    if (isGameOver) return;
    const sausage = document.createElement('img');
    let randomSausage = Math.floor(Math.random() * 3) + 1;
    sausage.src = 'worst-' + randomSausage + '.png';
    sausage.classList.add('sausage');

    const sausageWidth = sausage.width * 0.15; // 10%
    const gameContainerWidth = gameContainer.offsetWidth;

    const leftbound = 20;
    const rightbound = Math.round(gameContainerWidth - (sausageWidth * 2) - 20);

    const calculatedSpawnPostition = Math.round(Math.random() * (rightbound - leftbound) + leftbound);

    sausage.style.left = calculatedSpawnPostition + "px";

    if (sausage.style.left < 20) {
        console.log(sausage.style.left)
        sausage.style.left = 20;
    }

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
            if (isNearMouth(sausage)) {
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
                sausage.remove();
            } else {
                gameOver();
            }
            sausage.remove();
        } else {
            sausageTop += fallSpeed; // Falling speed
            sausage.style.top = sausageTop + 'px';
        }
    }, 18); // Falling rate
}

function isNearMouth(sausage, margin = 0) {
    const sausageRect = sausage.getBoundingClientRect();
    const jawRect = document.getElementById('player-jaw').getBoundingClientRect();

    const sausageLeftBound = sausageRect.left;
    const sausageRightBound = sausageRect.right;

    const jawLeftBound = jawRect.left;
    const jawRightBound = jawRect.right;

    const isNear = sausageRect.bottom > jawRect.top - margin &&
        sausageLeftBound < jawRightBound && sausageRightBound > jawLeftBound;
    return isNear;
}

function openMouth() {
    document.getElementById('player-jaw').classList.add('jaw-open');
    document.getElementById('player-jaw').classList.remove('jaw-closed');
}

function closeMouth() {
    document.getElementById('player-jaw').classList.add('jaw-closed');
    document.getElementById('player-jaw').classList.remove('jaw-open');
}

function gameOver() {
    isGameOver = true;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').style.display = 'flex';
    player.classList.add('spin');
    document.getElementById('player-jaw').classList.add('jaw-open');
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

function checkCollision() {
    if (!isGameOver) {
        const sausages = document.querySelectorAll('.sausage');
        const nearCollision = Array.from(sausages).some(sausage => isNearMouth(sausage, 50));

        if (nearCollision) {
            openMouth();
        } else {
            closeMouth();
        }
    }

}

function copy() {
    var copyText = document.getElementById("iban");
    navigator.clipboard.writeText(copyText.innerHTML);
    document.getElementById("copied-iban").style.display = "block";
}

gameLoop();
setInterval(checkCollision, 50);

