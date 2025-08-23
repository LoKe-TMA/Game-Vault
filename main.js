const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// Tabs
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Login & fetch user
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
    renderStorePage(data.user);
    renderSpinPage(data.user);
    renderTasksPage(data.user);
    renderReferPage(data.user);
    renderOrdersPage(data.user);
  }
}

// Render Pages
function renderStorePage(user) {
  document.getElementById("store").innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'https://via.placeholder.com/80'}" alt="profile">
      <h2>@${user.username || user.firstName}</h2>
      <div class="coins">💰 ${user.coins} Coins</div>
    </div>

    <div class="game-card">
      <h3>PUBG UC</h3>
      <button class="game-btn">Buy 60 UC</button>
    </div>

    <div class="game-card">
      <h3>MLBB Diamonds</h3>
      <button class="game-btn">Buy 100 Diamonds</button>
    </div>
  `;
}

function renderSpinPage(user) {
  document.getElementById("spin").innerHTML = `
    <h2>🎡 Spin Wheel</h2>
    <p>Coming soon...</p>
  `;
}

function renderTasksPage(user) {
  document.getElementById("tasks").innerHTML = `
    <h2>📋 Daily Tasks</h2>
    <div class="ads">
      <p>Watch Short Ad (10/day limit)</p>
      <button id="ad" class="game-btn">Watch Ad</button>
    </div>
  `;

  // Ads setup
  const AdController = window.Adsgram.init({ blockId: "int-14145" });
  document.getElementById("ad").addEventListener("click", () => {
    AdController.show()
      .then(() => alert("Reward!"))
      .catch((err) => alert(JSON.stringify(err)));
  });
}

function renderReferPage(user) {
  document.getElementById("refer").innerHTML = `
    <h2>👥 Refer & Earn</h2>
    <p>Invite friends to earn coins.</p>
  `;
}

function renderOrdersPage(user) {
  document.getElementById("orders").innerHTML = `
    <h2>📦 My Orders</h2>
    <p>No orders yet.</p>
  `;
}

// Login on load
if (user) loginUser();
