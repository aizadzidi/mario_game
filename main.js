// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio elements
const coinSound = document.getElementById('coinSound');
const jumpSound = document.getElementById('jumpSound');
const enemySound = document.getElementById('enemySound');
const levelCompleteSound = document.getElementById('levelCompleteSound');
const bgMusic = document.getElementById('bgMusic');

// UI elements
const mainMenu = document.getElementById('mainMenu');
const levelSelect = document.getElementById('levelSelect');
const instructions = document.getElementById('instructions');
const gameScreen = document.getElementById('gameScreen');
const pauseMenu = document.getElementById('pauseMenu');
const levelComplete = document.getElementById('levelComplete');

// Game state
const game = {
    width: canvas.width,
    height: canvas.height,
    gravity: 0.8,
    friction: 0.8,
    score: 0,
    currentLevel: 1,
    isPaused: false,
    isGameOver: false,
    coinsCollected: 0,
    totalCoins: 0,
    gameState: 'menu', // menu, playing, paused, complete
    animationId: null
};

// Player object with improved graphics
const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 15,
    isOnGround: false,
    color: '#e74c3c',
    direction: 1, // 1 for right, -1 for left
    animationFrame: 0,
    animationSpeed: 0.2
};

// Level data
const levels = {
    1: {
        name: "Tutorial",
        background: 'forest',
        platforms: [
            { x: 100, y: 300, width: 200, height: 20, color: '#27ae60' },
            { x: 400, y: 250, width: 150, height: 20, color: '#27ae60' },
            { x: 600, y: 200, width: 150, height: 20, color: '#27ae60' }
        ],
        coins: [
            { x: 150, y: 250, width: 20, height: 20, collected: false },
            { x: 450, y: 200, width: 20, height: 20, collected: false },
            { x: 650, y: 150, width: 20, height: 20, collected: false }
        ],
        enemies: [
            { x: 300, y: 260, width: 25, height: 25, velocityX: -1.5, speed: 1.5, direction: -1, patrolLeft: 250, patrolRight: 450, color: '#8e44ad' }
        ],
        playerStart: { x: 50, y: 200 }
    },
    2: {
        name: "Forest",
        background: 'forest',
        platforms: [
            { x: 50, y: 320, width: 120, height: 20, color: '#27ae60' },
            { x: 250, y: 280, width: 120, height: 20, color: '#27ae60' },
            { x: 450, y: 240, width: 120, height: 20, color: '#27ae60' },
            { x: 650, y: 200, width: 120, height: 20, color: '#27ae60' }
        ],
        coins: [
            { x: 100, y: 270, width: 20, height: 20, collected: false },
            { x: 300, y: 230, width: 20, height: 20, collected: false },
            { x: 500, y: 190, width: 20, height: 20, collected: false },
            { x: 700, y: 150, width: 20, height: 20, collected: false },
            { x: 400, y: 100, width: 20, height: 20, collected: false }
        ],
        enemies: [
            { x: 200, y: 280, width: 25, height: 25, velocityX: -1.5, speed: 1.5, direction: -1, patrolLeft: 150, patrolRight: 350, color: '#8e44ad' },
            { x: 500, y: 240, width: 25, height: 25, velocityX: 1.5, speed: 1.5, direction: 1, patrolLeft: 400, patrolRight: 600, color: '#e67e22' }
        ],
        playerStart: { x: 50, y: 200 }
    },
    3: {
        name: "Cave",
        background: 'cave',
        platforms: [
            { x: 100, y: 300, width: 100, height: 20, color: '#7f8c8d' },
            { x: 300, y: 250, width: 100, height: 20, color: '#7f8c8d' },
            { x: 500, y: 200, width: 100, height: 20, color: '#7f8c8d' },
            { x: 700, y: 150, width: 100, height: 20, color: '#7f8c8d' },
            { x: 200, y: 180, width: 80, height: 20, color: '#7f8c8d' },
            { x: 600, y: 130, width: 80, height: 20, color: '#7f8c8d' }
        ],
        coins: [
            { x: 150, y: 250, width: 20, height: 20, collected: false },
            { x: 350, y: 200, width: 20, height: 20, collected: false },
            { x: 550, y: 150, width: 20, height: 20, collected: false },
            { x: 750, y: 100, width: 20, height: 20, collected: false },
            { x: 250, y: 130, width: 20, height: 20, collected: false },
            { x: 650, y: 80, width: 20, height: 20, collected: false }
        ],
        enemies: [
            { x: 250, y: 250, width: 25, height: 25, velocityX: -2, speed: 2, direction: -1, patrolLeft: 200, patrolRight: 400, color: '#8e44ad' },
            { x: 550, y: 200, width: 25, height: 25, velocityX: 2, speed: 2, direction: 1, patrolLeft: 500, patrolRight: 700, color: '#e67e22' },
            { x: 650, y: 150, width: 25, height: 25, velocityX: -1.5, speed: 1.5, direction: -1, patrolLeft: 600, patrolRight: 750, color: '#c0392b' }
        ],
        playerStart: { x: 50, y: 200 }
    },
    4: {
        name: "Castle",
        background: 'castle',
        platforms: [
            { x: 50, y: 320, width: 80, height: 20, color: '#95a5a6' },
            { x: 200, y: 280, width: 80, height: 20, color: '#95a5a6' },
            { x: 350, y: 240, width: 80, height: 20, color: '#95a5a6' },
            { x: 500, y: 200, width: 80, height: 20, color: '#95a5a6' },
            { x: 650, y: 160, width: 80, height: 20, color: '#95a5a6' },
            { x: 150, y: 200, width: 60, height: 20, color: '#95a5a6' },
            { x: 450, y: 160, width: 60, height: 20, color: '#95a5a6' },
            { x: 300, y: 120, width: 60, height: 20, color: '#95a5a6' }
        ],
        coins: [
            { x: 100, y: 270, width: 20, height: 20, collected: false },
            { x: 250, y: 230, width: 20, height: 20, collected: false },
            { x: 400, y: 190, width: 20, height: 20, collected: false },
            { x: 550, y: 150, width: 20, height: 20, collected: false },
            { x: 700, y: 110, width: 20, height: 20, collected: false },
            { x: 200, y: 150, width: 20, height: 20, collected: false },
            { x: 500, y: 110, width: 20, height: 20, collected: false },
            { x: 350, y: 70, width: 20, height: 20, collected: false }
        ],
        enemies: [
            { x: 150, y: 230, width: 25, height: 25, velocityX: -2.5, speed: 2.5, direction: -1, patrolLeft: 100, patrolRight: 300, color: '#8e44ad' },
            { x: 400, y: 190, width: 25, height: 25, velocityX: 2.5, speed: 2.5, direction: 1, patrolLeft: 350, patrolRight: 550, color: '#e67e22' },
            { x: 600, y: 150, width: 25, height: 25, velocityX: -2, speed: 2, direction: -1, patrolLeft: 550, patrolRight: 700, color: '#c0392b' },
            { x: 300, y: 110, width: 25, height: 25, velocityX: 2, speed: 2, direction: 1, patrolLeft: 250, patrolRight: 400, color: '#d35400' }
        ],
        playerStart: { x: 50, y: 200 }
    }
};

// Current level data
let currentLevelData = null;
let platforms = [];
let coins = [];
let enemies = [];

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Pause game with ESC
    if (e.code === 'Escape' && game.gameState === 'playing') {
        pauseGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// UI Event Listeners
document.getElementById('playButton').addEventListener('click', () => startGame(1));
document.getElementById('levelSelectButton').addEventListener('click', showLevelSelect);
document.getElementById('instructionsButton').addEventListener('click', showInstructions);
document.getElementById('backToMenu').addEventListener('click', showMainMenu);
document.getElementById('backToMenu2').addEventListener('click', showMainMenu);

// Level select event listeners
document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
        const level = parseInt(card.dataset.level);
        startGame(level);
    });
});

// Game control event listeners
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('restartButton').addEventListener('click', restartLevel);
document.getElementById('menuButton').addEventListener('click', quitToMenu);

// Pause menu event listeners
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('restartLevelButton').addEventListener('click', restartLevel);
document.getElementById('quitToMenuButton').addEventListener('click', quitToMenu);

// Level complete event listeners
document.getElementById('nextLevelButton').addEventListener('click', nextLevel);
document.getElementById('replayLevelButton').addEventListener('click', restartLevel);
document.getElementById('levelSelectFromComplete').addEventListener('click', quitToMenu);

// Sound functions
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Audio play failed:', e));
    }
}

// UI functions
function showMainMenu() {
    hideAllScreens();
    mainMenu.classList.remove('hidden');
    game.gameState = 'menu';
    stopGameLoop();
}

function showLevelSelect() {
    hideAllScreens();
    levelSelect.classList.remove('hidden');
}

function showInstructions() {
    hideAllScreens();
    instructions.classList.remove('hidden');
}

function hideAllScreens() {
    mainMenu.classList.add('hidden');
    levelSelect.classList.add('hidden');
    instructions.classList.add('hidden');
    gameScreen.classList.add('hidden');
    pauseMenu.classList.add('hidden');
    levelComplete.classList.add('hidden');
}

function startGame(level) {
    game.currentLevel = level;
    game.score = 0;
    game.coinsCollected = 0;
    game.isPaused = false;
    game.isGameOver = false;
    game.gameState = 'playing';
    
    // Load level data
    currentLevelData = levels[level];
    platforms = [...currentLevelData.platforms];
    coins = currentLevelData.coins.map(coin => ({ ...coin, collected: false }));
    enemies = currentLevelData.enemies.map(enemy => ({ ...enemy }));
    
    // Reset player position
    player.x = currentLevelData.playerStart.x;
    player.y = currentLevelData.playerStart.y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isOnGround = false;
    
    game.totalCoins = coins.length;
    
    // Update UI
    hideAllScreens();
    gameScreen.classList.remove('hidden');
    updateUI();
    
    // Start game loop
    startGameLoop();
    
    // Play background music
    playSound(bgMusic);
}

function pauseGame() {
    if (game.gameState === 'playing') {
        game.isPaused = true;
        game.gameState = 'paused';
        pauseMenu.classList.remove('hidden');
        stopGameLoop();
    }
}

function resumeGame() {
    if (game.gameState === 'paused') {
        game.isPaused = false;
        game.gameState = 'playing';
        pauseMenu.classList.add('hidden');
        startGameLoop();
    }
}

function restartLevel() {
    startGame(game.currentLevel);
}

function quitToMenu() {
    showMainMenu();
}

function nextLevel() {
    if (game.currentLevel < Object.keys(levels).length) {
        startGame(game.currentLevel + 1);
    } else {
        showMainMenu();
    }
}

function updateUI() {
    document.getElementById('scoreValue').textContent = game.score;
    document.getElementById('levelValue').textContent = game.currentLevel;
    document.getElementById('coinsValue').textContent = `${game.coinsCollected}/${game.totalCoins}`;
}

function showLevelComplete() {
    game.gameState = 'complete';
    levelComplete.classList.remove('hidden');
    
    // Update final stats
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalCoins').textContent = `${game.coinsCollected}/${game.totalCoins}`;
    
    // Calculate stars based on performance
    const starRating = calculateStarRating();
    document.getElementById('finalStars').textContent = starRating;
    
    // Show/hide next level button
    const nextLevelBtn = document.getElementById('nextLevelButton');
    if (game.currentLevel >= Object.keys(levels).length) {
        nextLevelBtn.style.display = 'none';
    } else {
        nextLevelBtn.style.display = 'block';
    }
    
    playSound(levelCompleteSound);
    stopGameLoop();
}

function calculateStarRating() {
    const coinPercentage = game.coinsCollected / game.totalCoins;
    if (coinPercentage >= 0.9) return '★★★';
    if (coinPercentage >= 0.7) return '★★☆';
    return '★☆☆';
}

// Game loop functions
function startGameLoop() {
    if (game.animationId) {
        cancelAnimationFrame(game.animationId);
    }
    gameLoop();
}

function stopGameLoop() {
    if (game.animationId) {
        cancelAnimationFrame(game.animationId);
        game.animationId = null;
    }
}

// Game functions
function updatePlayer() {
    if (game.isPaused) return;
    
    // Horizontal movement
    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        player.direction = -1;
    } else if (keys['ArrowRight']) {
        player.velocityX = player.speed;
        player.direction = 1;
    } else {
        player.velocityX *= game.friction;
    }
    
    // Jumping
    if (keys['Space'] && player.isOnGround) {
        player.velocityY = -player.jumpPower;
        player.isOnGround = false;
        playSound(jumpSound);
    }
    
    // Apply gravity
    player.velocityY += game.gravity;
    
    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Update animation frame
    player.animationFrame += player.animationSpeed;
    
    // Check collisions
    checkPlatformCollision();
    checkCoinCollision();
    checkEnemyCollision();
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > game.width) player.x = game.width - player.width;
    if (player.y + player.height > game.height) {
        player.y = game.height - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
    }
}

function checkPlatformCollision() {
    player.isOnGround = false;
    
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height >= platform.y &&
            player.y < platform.y + platform.height) {
            
            // Landing on top of platform
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
            }
        }
    });
    
    // Check if player is on ground level
    if (player.y + player.height >= game.height) {
        player.isOnGround = true;
    }
}

function checkCoinCollision() {
    coins.forEach(coin => {
        if (!coin.collected &&
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            
            coin.collected = true;
            game.score += 10;
            game.coinsCollected++;
            playSound(coinSound);
            updateUI();
            
            // Check if all coins collected
            if (game.coinsCollected >= game.totalCoins) {
                setTimeout(showLevelComplete, 500);
            }
        }
    });
}

function checkEnemyCollision() {
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            playSound(enemySound);
            
            // Push player back
            if (player.x < enemy.x) {
                player.x = enemy.x - player.width;
            } else {
                player.x = enemy.x + enemy.width;
            }
            
            // Reset player position if they fall off screen
            if (player.y > game.height) {
                player.x = currentLevelData.playerStart.x;
                player.y = currentLevelData.playerStart.y;
                player.velocityX = 0;
                player.velocityY = 0;
            }
        }
    });
}

function updateEnemies() {
    if (game.isPaused) return;
    
    enemies.forEach(enemy => {
        // Move enemy
        enemy.x += enemy.velocityX;
        
        // Change direction at patrol boundaries
        if (enemy.x <= enemy.patrolLeft) {
            enemy.velocityX = enemy.speed;
            enemy.direction = 1;
        } else if (enemy.x >= enemy.patrolRight) {
            enemy.velocityX = -enemy.speed;
            enemy.direction = -1;
        }
    });
}

// Drawing functions with improved graphics
function drawPlayer() {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(player.x + 2, player.y + player.height - 5, player.width - 4, 5);
    
    // Draw body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw overalls
    ctx.fillStyle = '#3498db';
    ctx.fillRect(player.x + 5, player.y + 15, player.width - 10, player.height - 15);
    
    // Draw shirt
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, 10);
    
    // Draw eyes with animation
    ctx.fillStyle = '#ffffff';
    const eyeOffset = Math.sin(player.animationFrame) * 2;
    ctx.fillRect(player.x + 8 + eyeOffset, player.y + 8, 4, 4);
    ctx.fillRect(player.x + 18 + eyeOffset, player.y + 8, 4, 4);
    
    // Draw pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 9 + eyeOffset, player.y + 9, 2, 2);
    ctx.fillRect(player.x + 19 + eyeOffset, player.y + 9, 2, 2);
    
    // Draw mouth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + 12, player.y + 15, 6, 2);
    
    // Draw hat
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(player.x - 2, player.y - 8, player.width + 4, 8);
    
    // Draw hat detail
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(player.x, player.y - 6, player.width, 4);
    
    // Draw mustache
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(player.x + 8, player.y + 13, 14, 3);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        // Draw platform shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 2);
        
        // Draw platform base
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform texture
        ctx.fillStyle = '#229954';
        ctx.fillRect(platform.x + 3, platform.y + 3, platform.width - 6, 4);
        ctx.fillRect(platform.x + 5, platform.y + 10, platform.width - 10, 3);
        ctx.fillRect(platform.x + 8, platform.y + 16, platform.width - 16, 2);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            const centerX = coin.x + coin.width / 2;
            const centerY = coin.y + coin.height / 2;
            
            // Animate coin rotation
            const rotation = Date.now() * 0.01;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            // Draw coin glow
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.fillRect(-coin.width/2 - 2, -coin.height/2 - 2, coin.width + 4, coin.height + 4);
            
            // Draw coin body
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
            
            // Draw coin shine
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(-coin.width/2 + 2, -coin.height/2 + 2, coin.width - 4, coin.height - 4);
            
            // Draw dollar sign
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('$', 0, 4);
            
            ctx.restore();
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        const centerX = enemy.x + enemy.width / 2;
        const centerY = enemy.y + enemy.height / 2;
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(enemy.x + 2, enemy.y + enemy.height - 3, enemy.width - 4, 3);
        
        // Draw enemy body
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Draw enemy eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(enemy.x + 4, enemy.y + 4, 4, 4);
        ctx.fillRect(enemy.x + 17, enemy.y + 4, 4, 4);
        
        // Draw enemy pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 2, 2);
        ctx.fillRect(enemy.x + 18, enemy.y + 5, 2, 2);
        
        // Draw enemy mouth
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(enemy.x + 8, enemy.y + 15, 9, 3);
        
        // Draw enemy spikes
        ctx.fillStyle = '#2c3e50';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(enemy.x + 5 + i * 5, enemy.y - 3, 3, 3);
        }
    });
}

function drawBackground() {
    const bgType = currentLevelData.background;
    
    if (bgType === 'forest') {
        // Forest background
        const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#98FB98');
        gradient.addColorStop(1, '#228B22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, game.width, game.height);
        
        // Draw trees
        drawTrees();
    } else if (bgType === 'cave') {
        // Cave background
        const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#34495e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, game.width, game.height);
        
        // Draw cave stalactites
        drawStalactites();
    } else if (bgType === 'castle') {
        // Castle background
        const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.7, '#f39c12');
        gradient.addColorStop(1, '#e67e22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, game.width, game.height);
        
        // Draw castle towers
        drawCastleTowers();
    }
    
    // Draw clouds
    drawClouds();
}

function drawTrees() {
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 5; i++) {
        const x = 100 + i * 150;
        const y = game.height - 60;
        ctx.fillRect(x, y, 20, 60);
        
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
    }
}

function drawStalactites() {
    ctx.fillStyle = '#7f8c8d';
    for (let i = 0; i < 8; i++) {
        const x = 50 + i * 100;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 10, 30);
        ctx.lineTo(x - 10, 30);
        ctx.closePath();
        ctx.fill();
    }
}

function drawCastleTowers() {
    ctx.fillStyle = '#95a5a6';
    for (let i = 0; i < 3; i++) {
        const x = 200 + i * 200;
        ctx.fillRect(x, game.height - 80, 40, 80);
        ctx.fillRect(x - 5, game.height - 90, 50, 10);
    }
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    
    // Cloud 1
    ctx.beginPath();
    ctx.arc(100, 80, 20, 0, Math.PI * 2);
    ctx.arc(120, 80, 25, 0, Math.PI * 2);
    ctx.arc(140, 80, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloud 2
    ctx.beginPath();
    ctx.arc(600, 60, 15, 0, Math.PI * 2);
    ctx.arc(615, 60, 20, 0, Math.PI * 2);
    ctx.arc(630, 60, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloud 3
    ctx.beginPath();
    ctx.arc(400, 40, 18, 0, Math.PI * 2);
    ctx.arc(420, 40, 22, 0, Math.PI * 2);
    ctx.arc(440, 40, 18, 0, Math.PI * 2);
    ctx.fill();
}

function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, game.width, game.height);
    
    // Draw background
    drawBackground();
    
    // Draw platforms
    drawPlatforms();
    
    // Draw coins
    drawCoins();
    
    // Draw enemies
    drawEnemies();
    
    // Draw player
    drawPlayer();
}

function gameLoop() {
    updatePlayer();
    updateEnemies();
    drawGame();
    game.animationId = requestAnimationFrame(gameLoop);
}

// Initialize the game
showMainMenu(); 