const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// Page switching
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Login and fetch user
async function loginUser() {
  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      photoUrl: user.photo_url
    })
  });

  const data = await res.json();
  if (data.success && data.user) {
    initStorePage(data.user);
    initSpinPage(data.user);
    initTasksPage(data.user);
    initReferPage(data.user);
    initOrdersPage(data.user);
  }
}

// -------------------- Pages Init -------------------- //
function initStorePage(user) {
  const store = document.getElementById('store');
  store.innerHTML = `
    <div class="profile">
      <img src="${user.photo_url || 'default.png'}">
      <h2>${user.username || user.firstName}</h2>
      <p class="coins">💰 Coins: <span>${user.coins}</span></p>
    </div>
    <div class="ads">🔔 Ads Banner Placeholder</div>
    <div class="games">
      <div class="game-card">
        <h3>PUBG Mobile</h3>
        <button class="game-btn" onclick="alert('PUBG UC Store')">View UC Packs</button>
      </div>
      <div class="game-card">
        <h3>Mobile Legends</h3>
        <button class="game-btn" onclick="alert('MLBB Diamond Store')">View Diamonds</button>
      </div>
    </div>
  `;
}

function initSpinPage(user) {
  const spin = document.getElementById('spin');
  spin.innerHTML = `<h2>🎡 Spin</h2><p>Spin Tokens: ${user.spins}</p><button onclick="alert('Spin!')">Spin Now</button>`;
}

function initTasksPage(user) {
  const tasks = document.getElementById('tasks');
  tasks.innerHTML = `<h2>📋 Tasks</h2><ul>
    <li>▶ Watch Short Video</li>
    <li>⭐ Join Telegram Channel</li>
  </ul>`;
}

function initReferPage(user) {
  const refer = document.getElementById('refer');
  refer.innerHTML = `<h2>👥 Refer</h2>
    <p>Invite friends & earn rewards!</p>
    <button onclick="alert('Copied!')">Copy Invite Link</button>
    <p>Total Friends: 0</p>
    <p>Earned Coins: 0</p>`;
}

function initOrdersPage(user) {
  const orders = document.getElementById('orders');
  orders.innerHTML = `<h2>📦 Orders</h2><p>No orders yet.</p>`;
}

// Init
if(user) loginUser();
