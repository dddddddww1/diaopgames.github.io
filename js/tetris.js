function initTetris() {
    const container = document.createElement('div');
    container.className = 'tetris-container';
    
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    
    // 获取画布上下文
    const ctx = canvas.getContext('2d');
    
    // 定义游戏基本参数
    const blockSize = 30; // 在这里定义 blockSize
    const cols = Math.floor(canvas.width / blockSize);
    const rows = Math.floor(canvas.height / blockSize);
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let currentPiece = null;
    let score = 0;
    let level = 1;
    let gameInterval = null;
    let isPaused = false;
    
    // 定义方块形状和颜色
    const shapes = [
        [[1,1,1,1]], // I
        [[1,1,1],[0,1,0]], // T
        [[1,1,1],[1,0,0]], // L
        [[1,1,1],[0,0,1]], // J
        [[1,1],[1,1]], // O
        [[1,1,0],[0,1,1]], // Z
        [[0,1,1],[1,1,0]] // S
    ];
    
    const colors = [
        '#FF0D72', '#0DC2FF', '#0DFF72',
        '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
    ];
    
    // 添加游戏标题和开始界面
    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';
    startScreen.innerHTML = `
        <div class="game-header">
            <div class="close-btn">×</div>
        </div>
        <h2>俄罗斯方块</h2>
        <button id="startBtn" class="start-btn">
            <i class="fas fa-play"></i> 开始游戏
        </button>
        <div class="instructions-panel">
            <h3>操作说明：</h3>
            <div class="key-controls">
                <div class="key-item">
                    <span class="key">↑</span>
                    <span>旋转方块</span>
                </div>
                <div class="key-item">
                    <span class="key">←</span>
                    <span>左移</span>
                </div>
                <div class="key-item">
                    <span class="key">→</span>
                    <span>右移</span>
                </div>
                <div class="key-item">
                    <span class="key">↓</span>
                    <span>加速下落</span>
                </div>
            </div>
        </div>
    `;
    
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';
    gameArea.style.display = 'none';
    gameArea.innerHTML = `
        <div class="game-header">
            <div class="close-btn">×</div>
        </div>
    `;
    
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
        </div>
        <div class="score-panel">
            <div class="score-item">
                <label>得分</label>
                <span id="scoreDisplay">0</span>
            </div>
            <div class="score-item">
                <label>等级</label>
                <span id="levelDisplay">1</span>
            </div>
        </div>
    `;
    
    gameArea.appendChild(controlPanel);
    gameArea.appendChild(canvas);
    
    container.appendChild(startScreen);
    container.appendChild(gameArea);
    gameContainer.innerHTML = '';
    gameContainer.appendChild(container);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .tetris-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            background: #f8f9fa;
        }
        
        .start-screen {
            position: relative;
            text-align: center;
            padding: 40px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
            margin: 20px auto;
        }
        
        .start-screen h2 {
            color: #2c3e50;
            font-size: 32px;
            margin: 0 0 30px 0;
        }
        
        .start-btn {
            background: linear-gradient(145deg, #2ecc71, #27ae60);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
        }
        
        .key-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .key-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .key {
            background: #e9ecef;
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: bold;
            color: #333;
            min-width: 30px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .game-area {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
            margin: 20px auto;
        }
        
        canvas {
            border: 2px solid #2c3e50;
            border-radius: 8px;
            background-image: linear-gradient(rgba(44, 62, 80, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(44, 62, 80, 0.1) 1px, transparent 1px);
            background-size: ${blockSize}px ${blockSize}px;
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto;
        }
        
        .game-controls {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .control-buttons {
            display: flex;
            gap: 10px;
        }
        
        .game-btn {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .game-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
        }
        
        .score-panel {
            display: flex;
            gap: 20px;
        }
        
        .score-item {
            background: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 100px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .score-item label {
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
        }
        
        .score-item span {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .instructions-panel h3 {
            color: #2c3e50;
            font-size: 20px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 600px) {
            .tetris-container {
                padding: 10px;
            }
            
            .game-area {
                padding: 15px;
            }
            
            .score-item {
                min-width: 80px;
                padding: 8px 15px;
            }
            
            .game-btn {
                width: 40px;
                height: 40px;
            }
            
            .key-controls {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        .game-header {
            position: absolute;
            top: 0;
            right: 0;
            padding: 10px;
            z-index: 100;
        }
        
        .close-btn {
            position: relative;
            width: 32px;
            height: 32px;
            background: #ff4757;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .close-btn:hover {
            background: #ff6b81;
            transform: rotate(90deg);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
    
    function createPiece() {
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        return {
            shape: shapes[shapeIndex],
            color: colors[shapeIndex],
            x: Math.floor(cols/2) - Math.floor(shapes[shapeIndex][0].length/2),
            y: 0
        };
    }
    
    function draw() {
        // 清空画布
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制已固定的方块
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillStyle = value;
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            });
        });
        
        // 绘制当前下落的方块
        if (currentPiece) {
            ctx.fillStyle = currentPiece.color;
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        ctx.fillRect(
                            (currentPiece.x + x) * blockSize,
                            (currentPiece.y + y) * blockSize,
                            blockSize - 1,
                            blockSize - 1
                        );
                    }
                });
            });
        }
    }
    
    function collision(piece, offsetX = 0, offsetY = 0) {
        return piece.shape.some((row, y) => {
            return row.some((value, x) => {
                let newX = piece.x + x + offsetX;
                let newY = piece.y + y + offsetY;
                return (
                    value &&
                    (newX < 0 || newX >= cols ||
                     newY >= rows ||
                     (newY >= 0 && board[newY][newX])
                    )
                );
            });
        });
    }
    
    function merge() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                }
            });
        });
    }
    
    function clearLines() {
        let linesCleared = 0;
        outer: for (let y = rows - 1; y >= 0; y--) {
            for (let x = 0; x < cols; x++) {
                if (!board[y][x]) continue outer;
            }
            
            board.splice(y, 1);
            board.unshift(Array(cols).fill(0));
            linesCleared++;
            y++;
        }
        
        if (linesCleared) {
            sounds.match.play();
            score += linesCleared * 100 * level;
            document.getElementById('scoreDisplay').textContent = `得分: ${score}`;
            updateLevel();
        }
    }
    
    function rotate(piece) {
        let newShape = piece.shape[0].map((_, i) =>
            piece.shape.map(row => row[i]).reverse()
        );
        
        const rotated = {
            ...piece,
            shape: newShape
        };
        
        if (!collision(rotated)) {
            piece.shape = newShape;
        }
    }
    
    function gameLoop() {
        if (isPaused) return;
        
        if (collision(currentPiece, 0, 1)) {
            merge();
            clearLines();
            currentPiece = createPiece();
            if (collision(currentPiece)) {
                // 游戏结束
                clearInterval(gameInterval);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('游戏结束!', canvas.width/2, canvas.height/2 - 30);
                ctx.font = '20px Arial';
                ctx.fillText(`得分: ${score}`, canvas.width/2, canvas.height/2 + 10);
                ctx.fillText(`等级: ${level}`, canvas.width/2, canvas.height/2 + 40);
                
                setTimeout(() => {
                    alert(`游戏结束！\n得分：${score}\n等级：${level}`);
                }, 100);
                return;
            }
        } else {
            currentPiece.y++;
        }
        
        draw();
    }
    
    function updateLevel() {
        const newLevel = Math.floor(score / 1000) + 1;
        if (newLevel !== level) {
            level = newLevel;
            document.getElementById('levelDisplay').textContent = `等级: ${level}`;
            // 更新游戏速度
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, Math.max(100, 1000 - (level - 1) * 100));
        }
    }
    
    document.addEventListener('keydown', event => {
        if (isPaused) return;
        
        switch(event.keyCode) {
            case 37: // 左
                if (!collision(currentPiece, -1, 0)) {
                    currentPiece.x--;
                    sounds.move.play();
                }
                break;
            case 39: // 右
                if (!collision(currentPiece, 1, 0)) {
                    currentPiece.x++;
                    sounds.move.play();
                }
                break;
            case 40: // 下
                if (!collision(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    sounds.move.play();
                }
                break;
            case 38: // 上 (旋转)
                rotate(currentPiece);
                sounds.flip.play();
                break;
        }
        draw();
    });
    
    // 暂停/继续
    document.getElementById('pauseBtn').addEventListener('click', () => {
        isPaused = !isPaused;
        const pauseIcon = document.querySelector('#pauseBtn i');
        pauseIcon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
    });
    
    // 重新开始
    document.getElementById('restartBtn').addEventListener('click', () => {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0;
        level = 1;
        document.getElementById('scoreDisplay').textContent = `得分: ${score}`;
        document.getElementById('levelDisplay').textContent = `等级: ${level}`;
        currentPiece = createPiece();
        isPaused = false;
        document.querySelector('#pauseBtn i').className = 'fas fa-pause';
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / level);
    });
    
    // 添加开始游戏按钮事件
    document.getElementById('startBtn').addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    });
    
    // 修改开始游戏函数
    function startGame() {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0;
        level = 1;
        document.getElementById('scoreDisplay').textContent = '0';
        document.getElementById('levelDisplay').textContent = '1';
        currentPiece = createPiece();
        isPaused = false;
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000);
        draw();
    }
    
    // 添加关闭按钮的事件监听
    const closeBtn = gameArea.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        gameArea.style.display = 'none';
        startScreen.style.display = 'block';
        // 清理游戏状态
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        // 重置游戏状态
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0;
        level = 1;
        isPaused = false;
        currentPiece = null;
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // 添加开始界面关闭按钮的事件监听
    const startScreenCloseBtn = startScreen.querySelector('.close-btn');
    startScreenCloseBtn.addEventListener('click', () => {
        // 隐藏开始界面
        startScreen.style.display = 'none';
        // 关闭模态框
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    // 不要立即开始游戏，等待点击开始按钮
    draw();
} 