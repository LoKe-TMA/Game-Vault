const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// Show Page Tabs
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Auto Login + Fetch User
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
    document.getElementById("loading").style.display = "none";
    document.getElementById("app").style.display = "block";
    renderProfile(data.user);
    initTasksPage();
    initOrdersPage(data.user);
    initReferPage(data.user);
    initBannerAds();
  }
}

// Render Profile
function renderProfile(user) {
  document.getElementById("profile-pic").src = user.photoUrl || "assets/default.png";
  document.getElementById("profile-name").innerText = user.username || user.firstName;
  document.getElementById("coin-balance").innerText = user.coins;
}

// Rotate Banner Ads
function initBannerAds() {
  const banners = ["assets/banner1.png", "assets/banner2.png", "assets/banner3.png"];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % banners.length;
    document.getElementById("banner-img").src = banners[index];
  }, 10000);
}

// Init Tasks Page
async function initTasksPage() {
  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <button onclick="completeTask('${task._id}')">
        ${task.type === "ad" ? "🎬 Watch Ad" : "📌 Join"}
      </button>
    `;
    taskList.appendChild(div);
  });
}

// Complete Task
async function completeTask(taskId) {
  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: user.id, taskId })
  });

  const data = await res.json();
  if (data.success) {
    alert(`🎁 You earned ${data.reward} coins!`);
    document.getElementById("coin-balance").innerText = data.newBalance;
  } else {
    alert("⚠️ " + data.message);
  }
}

// Orders Page
async function initOrdersPage(user) {
  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/orders?telegramId=" + user.telegramId);
  const orders = await res.json();

  const list = document.getElementById("order-list");
  list.innerHTML = "";
  orders.forEach(order => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <h3>${order.game} - ${order.package}</h3>
      <p>Status: ${order.status}</p>
    `;
    list.appendChild(div);
  });
}

// Refer Page
function initReferPage(user) {
  document.getElementById("total-friends").innerText = user.referrals;
  document.getElementById("ref-coins").innerText = user.referrals * 100;
}
function inviteFriend() {
  tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/GameVaultBot?start=${user.id}`);
}
function copyLink() {
  navigator.clipboard.writeText(`https://t.me/GameVaultBot?start=${user.id}`);
  alert("🔗 Link copied!");
}

// Auto Login on Load
if (user) loginUser();
