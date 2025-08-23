const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// Tabs switching
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Login & load pages
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
  }
}

// --- Store Page ---
function initStorePage(user) {
  const storeDiv = document.getElementById("store");
  storeDiv.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="Profile">
      <h2>${user.firstName || ''} ${user.lastName || ''}</h2>
      <div class="coins">💰 ${user.coins} Coins</div>
    </div>

    <div class="game-card">
      <h3>PUBG MOBILE: UC</h3>
      <button class="game-btn" onclick="orderItem('PUBG', 60, 4300)">60 UC - 4300 Coins</button>
      <button class="game-btn" onclick="orderItem('PUBG', 180, 12000)">180 UC - 12000 Coins</button>
    </div>

    <div class="game-card">
      <h3>MLBB: Diamonds</h3>
      <button class="game-btn" onclick="orderItem('MLBB', 86, 5000)">86 Diamonds - 5000 Coins</button>
      <button class="game-btn" onclick="orderItem('MLBB', 172, 9500)">172 Diamonds - 9500 Coins</button>
    </div>
  `;
}

// --- Order function ---
async function orderItem(game, amount, cost) {
  if (!confirm(`Buy ${amount} ${game} for ${cost} coins?`)) return;

  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId: user.id,
      game,
      amount,
      cost
    })
  });

  const data = await res.json();
  if (data.success) {
    alert("✅ Order placed successfully!");
  } else {
    alert("❌ " + data.message);
  }
}

// Auto login on load
if (user) loginUser();
