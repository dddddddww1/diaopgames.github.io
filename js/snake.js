function initSnake() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '2px solid #2c3e50';
    canvas.style.borderRadius = '8px';
    canvas.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // 创建游戏控制按钮
    const controlPanel = document.createElement('div');
    controlPanel.className = 'game-controls';
    controlPanel.innerHTML = `
        <div class="control-buttons">
            <button id="pauseBtn" class="game-btn" title="暂停/继续">
                <i class="fas fa-pause"></i>
            </button>
            <button id="restartBtn" class="game-btn" title="重新开始">
                <i class="fas fa-redo"></i>
            </button>
            <button id="speedDownBtn" class="game-btn" title="减速">
                <i class="fas fa-minus"></i>
            </button>
            <button id="speedUpBtn" class="game-btn" title="加速">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="score-panel">
            <span id="speedDisplay">速度: 1x</span>
            <span id="scoreDisplay">得分: 0</span>
            <span id="highScore">最高分: 0</span>
        </div>
    `;
    
    // 添加Font Awesome图标
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    gameContainer.innerHTML = '';
    gameContainer.appendChild(controlPanel);
    gameContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const baseSpeed = 200; // 基础速度（数值越大速度越慢）
    let snake = [{x: 10, y: 10}];
    let food = generateFood();
    let direction = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameInterval = null;
    let isPaused = false;
    let currentSpeed = baseSpeed; // 当前速度
    
    document.getElementById('highScore').textContent = `最高分: ${highScore}`;
    
    // 获取控制按钮
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const speedUpBtn = document.getElementById('speedUpBtn');
    const speedDownBtn = document.getElementById('speedDownBtn');
    const speedDisplay = document.getElementById('speedDisplay');
    
    // 绘制网格背景
    function drawGrid() {
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        for (let i = 0; i <= canvas.height; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    }
    
    // 暂停/继续游戏
    function togglePause() {
        isPaused = !isPaused;
        const pauseIcon = pauseBtn.querySelector('i');
        pauseIcon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
        
        if (isPaused) {
            clearInterval(gameInterval);
        } else {
            gameInterval = setInterval(gameLoop, currentSpeed);
        }
    }
    
    // 重新开始游戏
    function restartGame() {
        snake = [{x: 10, y: 10}];
        food = generateFood();
        direction = 'right';
        score = 0;
        currentSpeed = baseSpeed; // 重置速度
        speedDisplay.textContent = '速度: 1x';
        isPaused = false;
        const pauseIcon = pauseBtn.querySelector('i');
        pauseIcon.className = 'fas fa-pause';
        updateScore();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, currentSpeed);
    }
    
    // 更新分数显示
    function updateScore() {
        scoreDisplay.textContent = `得分: ${score}`;
    }
    
    // 添加按钮事件监听
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartGame);
    speedUpBtn.addEventListener('click', () => changeSpeed(true));
    speedDownBtn.addEventListener('click', () => changeSpeed(false));
    
    // 原有的游戏函数保持不变...
    function clearCanvas() {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid();
    }
    
    function generateFood() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }
    
    function drawSnake() {
        snake.forEach((segment, index) => {
            // 蛇头使用不同的颜色
            if (index === 0) {
                ctx.fillStyle = '#2ecc71';
            } else {
                ctx.fillStyle = '#27ae60';
            }
            
            // 绘制圆角矩形
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            const size = gridSize - 2;
            const radius = 5;
            
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + size - radius, y);
            ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
            ctx.lineTo(x + size, y + size - radius);
            ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
            ctx.lineTo(x + radius, y + size);
            ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            
            // 添加眼睛（只在蛇头上）
            if (index === 0) {
                ctx.fillStyle = '#fff';
                const eyeSize = 3;
                // 根据方向调整眼睛位置
                let eyeX1, eyeX2, eyeY1, eyeY2;
                switch(direction) {
                    case 'right':
                        eyeX1 = eyeX2 = x + size - 8;
                        eyeY1 = y + 6; eyeY2 = y + size - 6;
                        break;
                    case 'left':
                        eyeX1 = eyeX2 = x + 8;
                        eyeY1 = y + 6; eyeY2 = y + size - 6;
                        break;
                    case 'up':
                        eyeX1 = x + 6; eyeX2 = x + size - 6;
                        eyeY1 = eyeY2 = y + 8;
                        break;
                    case 'down':
                        eyeX1 = x + 6; eyeX2 = x + size - 6;
                        eyeY1 = eyeY2 = y + size - 8;
                        break;
                }
                ctx.beginPath();
                ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
                ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    function drawFood() {
        const x = food.x * gridSize;
        const y = food.y * gridSize;
        const size = gridSize - 2;
        
        // 绘制食物主体
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加高光效果
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + size/3, y + size/3, size/6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function moveSnake() {
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch(direction) {
            case 'right': head.x++; break;
            case 'left': head.x--; break;
            case 'up': head.y--; break;
            case 'down': head.y++; break;
        }
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            sounds.match.play();  // 添加吃到食物音效
            food = generateFood();
            score += 10;
            updateScore();
        } else {
            snake.pop();
            sounds.move.play();  // 添加移动音效
        }
    }
    
    function checkCollision() {
        const head = snake[0];
        
        if (head.x < 0 || head.x >= canvas.width / gridSize ||
            head.y < 0 || head.y >= canvas.height / gridSize) {
            return true;
        }
        
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    function changeDirection(event) {
        if (isPaused) return; // 暂停时不允许改变方向
        
        const keyPressed = event.keyCode;
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;
        
        const goingUp = direction === 'up';
        const goingDown = direction === 'down';
        const goingRight = direction === 'right';
        const goingLeft = direction === 'left';
        
        if (keyPressed === LEFT && !goingRight) direction = 'left';
        if (keyPressed === UP && !goingDown) direction = 'up';
        if (keyPressed === RIGHT && !goingLeft) direction = 'right';
        if (keyPressed === DOWN && !goingUp) direction = 'down';
    }
    
    function endGame() {
        clearInterval(gameInterval);
        document.removeEventListener('keydown', changeDirection);
        
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById('highScore').textContent = `最高分: ${highScore}`;
        }
        
        // 绘制游戏结束画面
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width/2, canvas.height/2 - 30);
        ctx.font = '20px Arial';
        ctx.fillText(`得分: ${score}`, canvas.width/2, canvas.height/2 + 10);
        
        setTimeout(() => {
            alert(`游戏结束！得分：${score}`);
        }, 100);
    }
    
    function gameLoop() {
        if (isPaused) return;
        
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        
        if (checkCollision()) {
            endGame();
        }
    }
    
    // 添加速度控制函数
    function changeSpeed(faster) {
        if (faster && currentSpeed > 50) { // 最快速度限制
            currentSpeed -= 25;
        } else if (!faster && currentSpeed < 300) { // 最慢速度限制
            currentSpeed += 25;
        }
        
        // 更新速度显示
        const speedLevel = ((baseSpeed - currentSpeed) / 25) + 1;
        speedDisplay.textContent = `速度: ${speedLevel}x`;
        
        // 重新设置游戏循环
        if (gameInterval && !isPaused) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, currentSpeed);
        }
    }
    
    // 开始游戏
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(gameLoop, currentSpeed);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .game-controls {
            margin-bottom: 15px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 600px;
            margin: 0 auto 15px auto;
        }
        
        .modal-content {
            position: relative;
            background-color: #fff;
            margin: 2% auto;
            padding: 25px;
            width: 90%;
            max-width: 800px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        #gameContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
        }
        
        .control-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 0;
        }
        
        .game-btn {
            width: 40px;
            height: 40px;
            font-size: 14px;
            cursor: pointer;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .score-panel {
            display: flex;
            gap: 15px;
            margin-left: auto;
        }
        
        #scoreDisplay, #highScore, #speedDisplay {
            font-size: 14px;
            padding: 6px 12px;
            white-space: nowrap;
        }
        
        @media (max-width: 768px) {
            canvas {
                width: 100%;
                height: auto;
            }
            
            .game-controls {
                width: 100%;
                flex-direction: column;
                gap: 10px;
            }
            
            .score-panel {
                margin-left: 0;
                justify-content: center;
                width: 100%;
            }
        }
        
        /* 添加工具提示样式 */
        .game-btn:hover::after {
            content: attr(title);
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
        }
        
        /* 关闭按钮样式 */
        .close {
            position: absolute;
            right: 15px;
            top: 15px;
            width: 32px;
            height: 32px;
            background: #ff4757;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100;
        }

        .close::before,
        .close::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 2px;
            background: white;
            border-radius: 1px;
        }

        .close::before {
            transform: rotate(45deg);
        }

        .close::after {
            transform: rotate(-45deg);
        }

        .close:hover {
            background: #ff6b81;
            transform: rotate(90deg);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
    
    // 清理函数
    return function cleanup() {
        if (gameInterval) {
            clearInterval(gameInterval);
            document.removeEventListener('keydown', changeDirection);
        }
    };
} 