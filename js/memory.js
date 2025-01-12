function initMemory() {
    const container = document.createElement('div');
    container.className = 'memory-game';
    
    // 添加开始界面
    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';
    startScreen.innerHTML = `
        <div class="game-header">
            <div class="close-btn">×</div>
        </div>
        <h2>记忆翻牌</h2>
        <button id="startBtn" class="start-btn">
            <i class="fas fa-play"></i> 开始游戏
        </button>
        <div class="instructions-panel">
            <h3>游戏说明</h3>
            <div class="game-rules">
                <p>• 点击卡片翻开，找出相同的配对</p>
                <p>• 每次可以翻开两张卡片</p>
                <p>• 找出所有配对即可获胜</p>
                <p>• 尽量用最少的步数完成游戏</p>
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
                <label>步数</label>
                <span id="movesDisplay">0</span>
            </div>
            <div class="score-item">
                <label>配对</label>
                <span id="pairsDisplay">0/8</span>
            </div>
        </div>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    
    gameArea.appendChild(controlPanel);
    gameArea.appendChild(grid);
    
    container.appendChild(startScreen);
    container.appendChild(gameArea);
    gameContainer.innerHTML = '';
    gameContainer.appendChild(container);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .memory-game {
            max-width: 800px;
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
        
        .game-rules {
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 400px;
        }
        
        .game-rules p {
            margin: 10px 0;
            color: #2c3e50;
            font-size: 16px;
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
        
        .game-area {
            position: relative;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
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
            min-width: 100px;
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
        
        .card-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .card {
            aspect-ratio: 3/4;
            position: relative;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }
        
        .card.flipped {
            transform: rotateY(180deg);
        }
        
        .card-front,
        .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        
        .card-front {
            background: linear-gradient(135deg, #3498db, #2980b9);
            transform: rotateY(180deg);
            color: white;
        }
        
        .card-back {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            font-size: 24px;
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
        
        .game-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
        }
        
        @media (max-width: 600px) {
            .card-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .score-item {
                min-width: 80px;
            }
        }
    `;
    document.head.appendChild(style);
    
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    
    // 洗牌
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 创建卡片
    function createCards() {
        const shuffledCards = shuffle(cards);
        grid.innerHTML = '';
        
        shuffledCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-front">${emoji}</div>
                <div class="card-back">?</div>
            `;
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            
            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });
    }
    
    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;
        
        sounds.flip.play();
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('movesDisplay').textContent = `步数: ${moves}`;
            canFlip = false;
            
            const [card1, card2] = flippedCards;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                matchedPairs++;
                sounds.match.play();
                document.getElementById('pairsDisplay').textContent = `配对: ${matchedPairs}/8`;
                flippedCards = [];
                canFlip = true;
                
                if (matchedPairs === 8) {
                    setTimeout(() => {
                        sounds.win.play();
                        alert(`恭喜！你用了 ${moves} 步完成了游戏！`);
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    // 重新开始
    document.getElementById('restartBtn').addEventListener('click', () => {
        matchedPairs = 0;
        moves = 0;
        flippedCards = [];
        canFlip = true;
        document.getElementById('movesDisplay').textContent = `步数: 0`;
        document.getElementById('pairsDisplay').textContent = `配对: 0/8`;
        createCards();
    });
    
    // 添加开始游戏按钮事件
    document.getElementById('startBtn').addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameArea.style.display = 'block';
        createCards();
    });
    
    // 添加关闭按钮事件
    const closeBtn = gameArea.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        gameArea.style.display = 'none';
        startScreen.style.display = 'block';
        // 重置游戏状态
        matchedPairs = 0;
        moves = 0;
        flippedCards = [];
        canFlip = true;
        document.getElementById('movesDisplay').textContent = '0';
        document.getElementById('pairsDisplay').textContent = '0/8';
    });
    
    const startScreenCloseBtn = startScreen.querySelector('.close-btn');
    startScreenCloseBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    // 开始游戏
    createCards();
} 