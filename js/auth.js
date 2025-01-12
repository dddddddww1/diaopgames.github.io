// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDi7vqzG2JuxmPoWks5ZhurQqtdpXKYJjs",
    authDomain: "gamebox-698b2.firebaseapp.com",
    projectId: "gamebox-698b2",
    storageBucket: "gamebox-698b2.firebasestorage.app",
    messagingSenderId: "815241450919",
    appId: "1:815241450919:web:04061195dd42cb374f5282",
    measurementId: "G-4BVCVBK2Y6"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化 Firebase 服务
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// 创建 Google 认证提供程序
const googleProvider = new firebase.auth.GoogleAuthProvider();

// 配置 Firebase Auth 设置
auth.settings = {
    appVerificationDisabledForTesting: true
};

// 用户状态管理
let currentUser = null;

// 添加认证状态监听
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        updateUIForUser(user);
        loadUserGameHistory();
    } else {
        currentUser = null;
        updateUIForGuest();
    }
});

// 处理 Google 登录
async function handleGoogleLogin() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // 检查用户是否已存在
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // 如果是新用户，创建用户文档
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        document.getElementById('loginModal').style.display = 'none';
        showToast('登录成功！');
    } catch (error) {
        showToast('Google 登录失败：' + error.message);
    }
}

// 创建认证 UI
function createAuthUI() {
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    authContainer.innerHTML = `
        <div class="auth-buttons">
            <button id="loginBtn" class="auth-btn">
                <i class="fas fa-sign-in-alt"></i> 登录
            </button>
            <button id="registerBtn" class="auth-btn">
                <i class="fas fa-user-plus"></i> 注册
            </button>
            <button id="logoutBtn" class="auth-btn" style="display: none;">
                <i class="fas fa-sign-out-alt"></i> 退出
            </button>
        </div>
        <div id="userInfo" class="user-info" style="display: none;">
            <span class="user-avatar">
                <i class="fas fa-user-circle"></i>
            </span>
            <span id="userName"></span>
        </div>
    `;
    
    // 将认证容器添加到控制容器之后
    const controlsContainer = document.querySelector('.controls-container');
    if (controlsContainer) {
        controlsContainer.after(authContainer);
    } else {
        document.querySelector('header').appendChild(authContainer);
    }
    
    // 添加事件监听
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('registerBtn').addEventListener('click', showRegisterModal);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// 创建登录模态框
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

// 创建注册模态框
function createRegisterModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.id = 'registerModal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>注册</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="registerForm">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="registerName" required>
                </div>
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" id="registerEmail" required>
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="registerPassword" required>
                </div>
                <button type="submit" class="auth-submit-btn">注册</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 添加事件监听
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('loginModal').style.display = 'none';
        showToast('登录成功！');
    } catch (error) {
        showToast('登录失败：' + error.message);
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // 创建用户文档
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('registerModal').style.display = 'none';
        showToast('注册成功！');
    } catch (error) {
        showToast('注册失败：' + error.message);
    }
}

// 处理登出
async function handleLogout() {
    try {
        await auth.signOut();
        showToast('已退出登录');
    } catch (error) {
        showToast('退出失败：' + error.message);
    }
}

// 更新已登录用户的 UI
function updateUIForUser(user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    
    const userAvatar = document.querySelector('.user-avatar');
    if (user.photoURL) {
        userAvatar.innerHTML = `<img src="${user.photoURL}" alt="avatar">`;
    } else {
        userAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
    }
    
    document.getElementById('userName').textContent = user.displayName || user.email;
}

// 更新未登录用户的 UI
function updateUIForGuest() {
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('registerBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// 显示登录模态框
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// 显示注册模态框
function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 加载用户游戏历史
async function loadUserGameHistory() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('gameHistory')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
            
        // 处理游戏历史记录
        const history = snapshot.docs.map(doc => doc.data());
        updateGameHistoryUI(history);
    } catch (error) {
        console.error('加载游戏历史失败：', error);
    }
}

// 保存游戏记录
async function saveGameRecord(gameType, score) {
    if (!currentUser) return;
    
    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('gameHistory')
            .add({
                gameType,
                score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('保存游戏记录失败：', error);
    }
}

// 初始化认证系统
function initAuth() {
    createAuthUI();
    createLoginModal();
    createRegisterModal();
} 