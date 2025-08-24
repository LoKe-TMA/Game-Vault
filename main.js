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
    renderProfile(data.user);
    initTasksPage(data.user);
    initReferPage(data.user); // <-- Refer page init
  }
}

// Render Profile UI
function renderProfile(user) {
  document.getElementById("profile-pic").src = user.photoUrl || "assets/default.png";
  document.getElementById("profile-name").innerText = user.username || user.firstName;
  document.getElementById("coin-balance").innerText = user.coins;
}

// Init Tasks Page
async function initTasksPage(user) {
  const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-card";
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

// Complete Task & Reward Coins
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

// Init Refer Page
function initReferPage(user) {
  const referPage = document.getElementById("refer");
  const referralCoins = (user.referrals || 0) * 100;
  const referLink = `https://t.me/Game_VauIt_bot/start_${user.telegramId}`;

  referPage.innerHTML = `
    <h2>👥 Invite Friends</h2>
    <p>Refer Bonus: 100 Coins per friend</p>
    <p><b>Total Friends:</b> ${user.referrals || 0}</p>
    <p><b>Referral Coins:</b> ${referralCoins}</p>
    <div class="refer-link">
      <input type="text" value="${referLink}" readonly id="referLinkInput" />
      <button onclick="copyReferLink()">📋 Copy</button>
      <a href="${referLink}" target="_blank">
        <button>🚀 Invite</button>
      </a>
    </div>
  `;
}

// Copy Refer Link
function copyReferLink() {
  const input = document.getElementById("referLinkInput");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("✅ Referral link copied!");
}

// Auto Login on Load
if (user) loginUser();
