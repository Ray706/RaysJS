const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false
};

const keys = {
    right: false,
    left: false,
    up: false
};

const platforms = [
    { x: 0, y: canvas.height - 100, width: canvas.width, height: 20 },
    { x: 200, y: canvas.height - 200, width: 100, height: 20 },
    { x: 400, y: canvas.height - 300, width: 100, height: 20 }
];

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    if (keys.up && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    player.dy += player.gravity;

    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.grounded = true;
        }
    });

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clear();
    drawPlatforms();
    drawPlayer();
    updatePlayer();

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight') {
        keys.right = true;
    } else if (e.key === 'ArrowLeft') {
        keys.left = true;
    } else if (e.key === 'ArrowUp') {
        keys.up = true;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight') {
        keys.right = false;
    } else if (e.key === 'ArrowLeft') {
        keys.left = false;
    } else if (e.key === 'ArrowUp') {
        keys.up = false;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
