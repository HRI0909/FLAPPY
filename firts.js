const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1300;
canvas.height = 600;

// Game variables
let bird, pipes, score, isGameOver, backgroundImage, birdImage, pipeImage, jumpSound, scoreSound, restartButton;

function setup() {
    bird = {
        x: 100,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        velocity: 0,
        gravity: 0.2, // Decreased gravity
        jump: -5, // Decreased jump strength
        flap: function() {
            this.velocity = this.jump;
            jumpSound.currentTime = 0;
            jumpSound.play();
        },
        draw: function() {
            ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
        },
        update: function() {
            this.velocity += this.gravity;
            this.y += this.velocity;
        }
    };

    pipes = [];
    score = 0;
    isGameOver = false;

    restartButton = {
        x: canvas.width / 2 - 50,
        y: canvas.height / 2 + 50,
        width: 100,
        height: 50,
        draw: function() {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.fillText('Restart', this.x + 15, this.y + 30);
        }
    };

    // Generate initial pipes
    spawnPipes();
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    bird.draw();

    if (!isGameOver) {
        bird.update();
        drawPipes();
        updatePipes();
        checkCollision();
    } else {
        drawGameOverScreen();
    }

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);
}

function spawnPipes() {
    pipes.push({
        x: canvas.width,
        y: 0,
        width: 80,
        height: Math.random() * (canvas.height - 200) + 100
    });
}

function drawPipes() {
    pipes.forEach(function(pipe) {
        ctx.drawImage(pipeImage, pipe.x, pipe.y, pipe.width, pipe.height);
        ctx.drawImage(pipeImage, pipe.x, pipe.height + 150, pipe.width, canvas.height - pipe.height - 150);
    });
}

function updatePipes() {
    pipes.forEach(function(pipe) {
        pipe.x -= 2;

        if (pipe.x + pipe.width <= 0) {
            pipes.shift();
            spawnPipes();
            score++;
            scoreSound.currentTime = 0;
            scoreSound.play();
        }
    });
}

function checkCollision() {
    pipes.forEach(function(pipe) {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.height &&
            bird.y + bird.height > pipe.y) {
            gameOver();
        }

        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height + 150 &&
            bird.y + bird.height > pipe.height + 150) {
            gameOver();
        }
    });

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 20);

    restartButton.draw();
}

function restartGame() {
    if (isGameOver) {
        setup();
        isGameOver = false;
    }
}

// User input
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isGameOver) {
        bird.flap();
    }

    if (isGameOver && event.code === 'Enter') {
        restartGame();
    }
});

document.addEventListener('click', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (mouseX >= restartButton.x && mouseX <= restartButton.x + restartButton.width &&
        mouseY >= restartButton.y && mouseY <= restartButton.y + restartButton.height) {
        restartGame();
    }
});

// Load images and sounds
backgroundImage = new Image();
backgroundImage.src = 'bg.png';

birdImage = new Image();
birdImage.src = 'bird.png';

pipeImage = new Image();
pipeImage.src = 'pipe.png';

jumpSound = new Audio('fly.mp3');
scoreSound = new Audio('score.mp3');

// Start the game
setup();
setInterval(draw, 10); // Game loop
