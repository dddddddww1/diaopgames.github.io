function init2048() {
    const container = document.createElement('div');
    container.className = 'game-2048';
    
    // 添加游戏标题和开始界面
    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';
    startScreen.innerHTML = `
        <div class="game-header">
            <div class="close-btn">×</div>
        </div>
        <h2>2048</h2>
        <button id="startBtn" class="start-btn">
            <i class="fas fa-play"></i> 开始游戏
        </button>
        <div class="instructions-panel">
            <h3>操作说明</h3>
            <div class="key-controls">
                <div class="key-item">
                    <span class="key">↑</span>
                    <span>向上合并</span>
                </div>
                <div class="key-item">
                    <span class="key">↓</span>
                    <span>向下合并</span>
                </div>
                <div class="key-item">
                    <span class="key">←</span>
                    <span>向左合并</span>
                </div>
                <div class="key-item">
                    <span class="key">→</span>
                    <span>向右合并</span>
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
            <button id="restartBtn" class="game-btn" title="重新开始">
                <i class="fas fa-redo"></i>
            </button>
        </div>
        <div class="score-panel">
            <div class="score-item">
                <label>当前分数</label>
                <span id="scoreDisplay">0</span>
            </div>
            <div class="score-item">
                <label>最高分数</label>
                <span id="bestScore">0</span>
            </div>
        </div>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'grid';
    
    // 创建网格
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        grid.appendChild(cell);
    }
    
    gameArea.appendChild(controlPanel);
    gameArea.appendChild(grid);
    
    container.appendChild(startScreen);
    container.appendChild(gameArea);
    gameContainer.innerHTML = '';
    gameContainer.appendChild(container);
    
    // 修改样式
    const style = document.createElement('style');
    style.textContent = `
        .game-2048 {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .start-screen {
            position: relative;
            text-align: center;
            padding: 40px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .start-screen h2 {
            color: #2c3e50;
            font-size: 32px;
            margin: 0 0 30px 0;
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
        
        .instructions-panel h3 {
            color: #2c3e50;
            font-size: 20px;
            margin: 20px 0;
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
            margin: 20px 0;
        }
        
        .start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
        }

        /* 修改关闭按钮样式 */
        .game-header {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
        }
        
        .close-btn {
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

        .game-area {
            position: relative;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            background: #bbada0;
            padding: 12px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .cell {
            background: rgba(238, 228, 218, 0.35);
            border-radius: 6px;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            color: #776e65;
            position: relative;
        }
        
        .tile {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #eee4da;
            border-radius: 6px;
            font-size: 24px;
            font-weight: bold;
            transition: all 0.15s ease;
        }
        
        .game-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .score-panel {
            display: flex;
            gap: 20px;
        }
        
        .score-item {
            background: #f8f9fa;
            padding: 8px 15px;
            border-radius: 10px;
            text-align: center;
        }
        
        .score-item label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }
        
        .score-item span {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .game-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tile-2 { background: #eee4da; }
        .tile-4 { background: #ede0c8; }
        .tile-8 { background: #f2b179; color: white; }
        .tile-16 { background: #f59563; color: white; }
        .tile-32 { background: #f67c5f; color: white; }
        .tile-64 { background: #f65e3b; color: white; }
        .tile-128 { background: #edcf72; color: white; font-size: 20px; }
        .tile-256 { background: #edcc61; color: white; font-size: 20px; }
        .tile-512 { background: #edc850; color: white; font-size: 20px; }
        .tile-1024 { background: #edc53f; color: white; font-size: 18px; }
        .tile-2048 { background: #edc22e; color: white; font-size: 18px; }
    `;
    document.head.appendChild(style);
    
    let board = Array(4).fill().map(() => Array(4).fill(0));
    let score = 0;
    let bestScore = localStorage.getItem('2048BestScore') || 0;
    
    document.getElementById('bestScore').textContent = `最高分: ${bestScore}`;
    
    function addTile() {
        const emptyCells = [];
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (!cell) emptyCells.push([i, j]);
            });
        });
        
        if (emptyCells.length) {
            const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[i][j] = Math.random() < 0.9 ? 2 : 4;
            updateDisplay();
        }
    }
    
    function updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const i = Math.floor(index / 4);
            const j = index % 4;
            const value = board[i][j];
            
            cell.innerHTML = value ? `<div class="tile tile-${value}">${value}</div>` : '';
        });
        
        document.getElementById('scoreDisplay').textContent = `得分: ${score}`;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('2048BestScore', bestScore);
            document.getElementById('bestScore').textContent = `最高分: ${bestScore}`;
        }
    }
    
    function move(direction) {
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));
        
        function moveInDirection(arr) {
            const filtered = arr.filter(x => x);
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    score += filtered[i];
                    filtered.splice(i + 1, 1);
                    moved = true;
                    sounds.merge.play();
                }
            }
            while (filtered.length < 4) filtered.push(0);
            return filtered;
        }
        
        if (direction === 'left' || direction === 'right') {
            board.forEach((row, i) => {
                let newRow = [...row];
                if (direction === 'right') newRow.reverse();
                newRow = moveInDirection(newRow);
                if (direction === 'right') newRow.reverse();
                board[i] = newRow;
                if (JSON.stringify(board[i]) !== JSON.stringify(newBoard[i])) moved = true;
            });
        } else {
            for (let j = 0; j < 4; j++) {
                let col = board.map(row => row[j]);
                if (direction === 'down') col.reverse();
                col = moveInDirection(col);
                if (direction === 'down') col.reverse();
                board.forEach((row, i) => {
                    if (row[j] !== col[i]) moved = true;
                    row[j] = col[i];
                });
            }
        }
        
        if (moved) {
            sounds.move.play();
            addTile();
            if (isGameOver()) {
                setTimeout(() => {
                    sounds.gameOver.play();
                    alert(`游戏结束！得分：${score}`);
                }, 100);
            }
        }
    }
    
    function isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (!board[i][j]) return false;
            }
        }
        
        // 检查是否可以合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (
                    (i < 3 && board[i][j] === board[i + 1][j]) ||
                    (j < 3 && board[i][j] === board[i][j + 1])
                ) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 键盘控制
    document.addEventListener('keydown', event => {
        switch(event.keyCode) {
            case 37: move('left'); break;
            case 38: move('up'); break;
            case 39: move('right'); break;
            case 40: move('down'); break;
        }
    });
    
    // 重新开始
    document.getElementById('restartBtn').addEventListener('click', () => {
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        addTile();
        addTile();
        updateDisplay();
    });
    
    // 添加关闭按钮事件
    const closeBtn = gameArea.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        gameArea.style.display = 'none';
        startScreen.style.display = 'block';
        // 重置游戏状态
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        updateDisplay();
    });
    
    const startScreenCloseBtn = startScreen.querySelector('.close-btn');
    startScreenCloseBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    // 添加开始游戏按钮事件
    document.getElementById('startBtn').addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameArea.style.display = 'block';
        // 开始新游戏
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        addTile();
        addTile();
        updateDisplay();
    });
    
    // 开始游戏
    addTile();
    addTile();
    updateDisplay();
} 