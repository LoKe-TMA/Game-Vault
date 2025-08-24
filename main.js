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
  try {
    const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks");
    const data = await res.json();

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    if (data.success && data.tasks.length > 0) {
      data.tasks.forEach(task => {
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
    } else {
      taskList.innerHTML = "<p>No tasks available</p>";
    }
  } catch (err) {
    console.error("Tasks error:", err);
  }
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
    initTasksPage(user); // refresh tasks after completion
  } else {
    alert("⚠️ " + data.message);
  }
}

// Auto Login on Load
if (user) loginUser();
