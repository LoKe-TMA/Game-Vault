const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// API Base URL
const API_URL = "https://gamevault-backend-nf5g.onrender.com/api";

// Tabs
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Auto Login & Register
async function loginUser() {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
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
      renderHomePage(data.user);
    } else {
      alert("Login Failed ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
}

// Render Home Page
function renderHomePage(user) {
  const homePage = document.getElementById("home");
  homePage.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="profile">
      <h2>${user.firstName} ${user.lastName || ''}</h2>
      <p>@${user.username || ''}</p>
      <div class="coins">💰 Coins: ${user.coins}</div>
    </div>

    <div class="ads">
      <p>🔥 Banner Ads Here</p>
    </div>

    <div class="games">
      <h3>Available Games</h3>
      <div class="game-card">PUBG MOBILE : UC</div>
      <div class="game-card">Mobile Legends : Diamonds</div>
    </div>
  `;
}

// Tasks Logic 
async function initTasksPage(user) {
  document.getElementById("task-balance").innerText = `Coins: ${user.coins}`;

  const res = await fetch(`${API_URL}/tasks`);
  const data = await res.json();

  const container = document.getElementById("task-list");
  container.innerHTML = "";

  if (data.success && data.tasks.length > 0) {
    data.tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerHTML = `
        <h3>${task.title}</h3>
        <p>Reward: ${task.reward} coins</p>
        ${task.type === "join" ? `<a href="${task.link}" target="_blank">Join</a>` : ""}
        <button onclick="completeTask('${user.telegramId}','${task._id}')">✅ Complete</button>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p>No tasks available.</p>";
  }
}

async function completeTask(telegramId, taskId) {
  const res = await fetch(`${API_URL}/tasks/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, taskId })
  });

  const data = await res.json();
  if (data.success) {
    alert("🎁 Task Completed!");
    document.getElementById("task-balance").innerText = `Coins: ${data.newBalance}`;
  } else {
    alert("Error: " + data.message);
  }
}

// Run auto login
if (user) loginUser();
