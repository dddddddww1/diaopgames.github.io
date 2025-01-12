const modal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');
const closeBtn = document.querySelector('.close');

// 添加音效管理
const sounds = {
    click: new Audio('sounds/click.mp3'),
    flip: new Audio('sounds/flip.mp3'),
    match: new Audio('sounds/match.mp3'),
    win: new Audio('sounds/win.mp3'),
    move: new Audio('sounds/move.mp3'),
    merge: new Audio('sounds/merge.mp3'),
    gameOver: new Audio('sounds/game-over.mp3'),
    bgm: new Audio('sounds/bgm.mp3')
};

// 添加错误处理
Object.values(sounds).forEach(sound => {
    sound.addEventListener('error', (e) => {
        console.log('音频加载失败，静音继续');
        sound.muted = true;
    });
});

// 设置音频加载状态标志
let soundsLoaded = false;

// 预加载音频
function preloadSounds() {
    let loadedCount = 0;
    const totalSounds = Object.keys(sounds).length;
    
    Object.values(sounds).forEach(sound => {
        sound.addEventListener('canplaythrough', () => {
            loadedCount++;
            if (loadedCount === totalSounds) {
                soundsLoaded = true;
            }
        }, { once: true });
        
        sound.load();
    });
}

// 调用预加载
preloadSounds();

// 设置背景音乐循环播放
sounds.bgm.loop = true;
sounds.bgm.volume = 0.5; // 设置背景音乐音量为50%

// 音效控制按钮
function addControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    
    // 音乐按钮
    const musicBtn = document.createElement('button');
    musicBtn.className = 'music-btn';
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.title = '背景音乐开关';
    
    // 音效按钮
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-btn';
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundBtn.title = '音效开关';
    
    // 全屏按钮
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.title = '全屏模式';
    
    // 添加按钮到容器
    controlsContainer.appendChild(musicBtn);
    controlsContainer.appendChild(soundBtn);
    
    // 添加到页面
    document.querySelector('header').appendChild(controlsContainer);
    // 单独添加全屏按钮到 header
    document.querySelector('header').appendChild(fullscreenBtn);
    
    // 添加事件监听
    let isSoundMuted = localStorage.getItem('gameSoundMuted') === 'true';
    let isMusicMuted = localStorage.getItem('gameMusicMuted') === 'true';
    
    updateSoundIcon();
    updateMusicIcon();
    
    soundBtn.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        localStorage.setItem('gameSoundMuted', isSoundMuted);
        updateSoundIcon();
        if (!isSoundMuted) sounds.click.play();
    });
    
    musicBtn.addEventListener('click', () => {
        isMusicMuted = !isMusicMuted;
        localStorage.setItem('gameMusicMuted', isMusicMuted);
        updateMusicIcon();
        if (!isSoundMuted) sounds.click.play();
    });
    
    fullscreenBtn.addEventListener('click', () => {
        sounds.click.play();
        toggleFullscreen();
    });
    
    function updateSoundIcon() {
        soundBtn.querySelector('i').className = isSoundMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        Object.entries(sounds).forEach(([key, sound]) => {
            if (key !== 'bgm') sound.muted = isSoundMuted;
        });
    }
    
    function updateMusicIcon() {
        const icon = musicBtn.querySelector('i');
        if (isMusicMuted) {
            // 添加一个斜线，但保持音乐图标可见
            icon.className = 'fas fa-music';
            icon.style.position = 'relative';
            icon.style.opacity = '0.5';  // 降低透明度表示静音
            
            // 添加斜线
            if (!icon.querySelector('.slash')) {
                const slash = document.createElement('div');
                slash.className = 'slash';
                icon.appendChild(slash);
            }
            
            sounds.bgm.pause();
        } else {
            icon.className = 'fas fa-music';
            icon.style.opacity = '1';
            const slash = icon.querySelector('.slash');
            if (slash) {
                slash.remove();
            }
            sounds.bgm.play().catch(() => {
                isMusicMuted = true;
                updateMusicIcon();
            });
        }
        sounds.bgm.muted = isMusicMuted;
    }
}

// 整合所有样式到一个地方
const style = document.createElement('style');
style.textContent = `
    .controls-container {
        position: absolute;
        right: 25px;
        top: 15px;
        display: flex;
        gap: 8px;
        align-items: center;
        z-index: 1000;
        background: rgba(52, 152, 219, 0.1);
        padding: 6px;
        border-radius: 22px;
        backdrop-filter: blur(5px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .fullscreen-btn {
        position: absolute;
        left: 15px;  /* 设置左边距 */
        top: 15px;   /* 设置上边距 */
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #3498db;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    .fullscreen-btn i {
        font-size: 12px;
        line-height: 1;
    }
    
    .fullscreen-btn:hover {
        transform: scale(1.1);
        background: #2980b9;
    }
    
    .sound-btn,
    .music-btn {
        position: static;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #3498db;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .sound-btn i,
    .music-btn i {
        font-size: 13px;
        line-height: 1;
    }
    
    .sound-btn:hover,
    .music-btn:hover {
        transform: scale(1.1);
        background: #2980b9;
    }
`;

document.head.appendChild(style);

// 初始化控制按钮
addControls();

function openGame(gameType) {
    sounds.click.play();
    modal.style.display = 'block';
    gameContainer.innerHTML = '';
    
    switch(gameType) {
        case 'tetris':
            initTetris();
            break;
        case 'snake':
            initSnake();
            break;
        case '2048':
            init2048();
            break;
        case 'memory':
            initMemory();
            break;
    }
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
    gameContainer.innerHTML = '';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        gameContainer.innerHTML = '';
    }
}

// 全屏切换功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`全屏请求失败: ${err.message}`);
        });
        document.querySelector('.fullscreen-btn i').className = 'fas fa-compress';
    } else {
        document.exitFullscreen();
        document.querySelector('.fullscreen-btn i').className = 'fas fa-expand';
    }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
    const icon = document.querySelector('.fullscreen-btn i');
    if (document.fullscreenElement) {
        icon.className = 'fas fa-compress';
    } else {
        icon.className = 'fas fa-expand';
    }
});

// 添加样式
style.textContent += `
    .fullscreen-btn {
        position: absolute;
        right: 70px;  /* 放在音量按钮旁边 */
        top: 20px;
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
    
    .fullscreen-btn:hover {
        background: #2980b9;
        transform: scale(1.1);
    }
    
    /* 全屏时的样式调整 */
    :fullscreen .game-container {
        max-width: none;
        height: 100vh;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

// 添加游戏分类数据
const games = {
    'tetris': {
        name: '俄罗斯方块',
        category: ['动作游戏', '益智游戏'],
        description: '经典的俄罗斯方块游戏，考验你的反应能力！',
        image: 'https://via.placeholder.com/300x200'
    },
    'snake': {
        name: '贪吃蛇',
        category: ['动作游戏'],
        description: '控制蛇吃食物成长，不要撞到墙壁或自己！',
        image: 'https://via.placeholder.com/300x200'
    },
    '2048': {
        name: '2048',
        category: ['益智游戏', '策略游戏'],
        description: '合并数字块，看看你能否达到2048！',
        image: 'https://via.placeholder.com/300x200'
    },
    'memory': {
        name: '记忆翻牌',
        category: ['益智游戏'],
        description: '考验记忆力的翻牌游戏，找出所有配对！',
        image: 'https://via.placeholder.com/300x200'
    }
};

// 添加分类功能
function initCategories() {
    const nav = document.querySelector('nav');
    const gameContainer = document.querySelector('.game-container');
    
    // 添加分类点击事件
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            sounds.click.play();
            
            // 更新激活状态
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
            
            // 获取选中的分类
            const category = e.target.textContent;
            
            // 过滤并显示游戏
            filterGames(category);
            
            // 添加动画效果
            gameContainer.style.opacity = '0';
            setTimeout(() => {
                gameContainer.style.opacity = '1';
            }, 300);
        }
    });
}

// 过滤游戏
function filterGames(category) {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = '';
    
    Object.entries(games).forEach(([gameId, game]) => {
        if (category === '全部游戏' || game.category.includes(category)) {
            const gameCard = createGameCard(gameId, game);
            gameContainer.appendChild(gameCard);
        }
    });
}

// 创建游戏卡片
function createGameCard(gameId, game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <button onclick="openGame('${gameId}')">开始游戏</button>
        <div class="game-categories">
            ${game.category.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
        </div>
    `;
    return card;
}

// 添加样式
style.textContent += `
    .game-card {
        position: relative;
        overflow: hidden;
    }
    
    .game-categories {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }
    
    .category-tag {
        background: rgba(52, 152, 219, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
    }
    
    .game-card {
        transform: scale(1);
        transition: transform 0.3s ease;
    }
    
    .game-card:hover {
        transform: scale(1.02);
    }
    
    nav a {
        position: relative;
        transition: all 0.3s ease;
        text-decoration: none;
        color: #333;
        padding: 8px 16px;
        border-radius: 20px;
        background: transparent;
    }
    
    nav a:hover {
        background: rgba(52, 152, 219, 0.1);
    }
    
    nav a.active {
        background: #3498db;
        color: white;
    }
    
    nav a::after {
        display: none;
    }
    
    .game-container {
        transition: opacity 0.3s ease;
    }
`;

// 初始化游戏卡片
function initGameCards() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = '';
    
    Object.entries(games).forEach(([gameId, game]) => {
        const card = createGameCard(gameId, game);
        gameContainer.appendChild(card);
    });
}

// 在页面加载时初始化游戏卡片
document.addEventListener('DOMContentLoaded', () => {
    initGameCards();
});

// 初始化分类功能
initCategories(); 

// 在页面加载完成后开始播放背景音乐
document.addEventListener('DOMContentLoaded', () => {
    const isMusicMuted = localStorage.getItem('gameMusicMuted') === 'true';
    if (!isMusicMuted) {
        // 添加用户交互后自动播放
        document.addEventListener('click', () => {
            sounds.bgm.play().catch(() => {
                console.log('背景音乐自动播放被阻止');
            });
        }, { once: true });
    }
}); 

// 添加斜线的样式
style.textContent += `
    .slash {
        position: absolute;
        width: 100%;
        height: 2px;
        background: white;
        top: 50%;
        left: 0;
        transform: rotate(-45deg);
    }
    
    .music-btn i {
        position: relative;
        display: inline-block;
    }
`; 

// 修改登录模态框的创建函数
function createLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>登录</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="loginPassword" required>
                </div>
                <button type="submit" class="auth-submit-btn">登录</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 添加事件监听
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}