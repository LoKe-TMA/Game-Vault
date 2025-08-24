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
    initHomePage(data.user);
    initTasksPage(data.user);
    // future: initReferPage(data.user), initOrdersPage(data.user)
  }
}

// Update coin balance UI
function updateCoins(newCoins) {
  const coinEl = document.getElementById("coin-balance");
  if (coinEl) coinEl.innerText = newCoins;
}

// ------------------ HOME ------------------
function initHomePage(user) {
  const profile = document.getElementById("profile");
  if (!profile) return;

  profile.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="Profile">
      <h2>${user.firstName || ''} ${user.lastName || ''}</h2>
      <p>@${user.username || ''}</p>
      <div class="coins">💰 <span id="coin-balance">${user.coins}</span> Coins</div>
    </div>
  `;
}

// ------------------ TASKS ------------------
async function initTasksPage(user) {
  const taskList = document.getElementById("task-list");
  if (!taskList) return;
  
  taskList.innerHTML = "<p>Loading tasks...</p>";

  try {
    const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks");
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      taskList.innerHTML = "<p>No tasks available</p>";
      return;
    }

    taskList.innerHTML = "";

    data.forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";

      const title = document.createElement("div");
      title.className = "task-title";
      title.innerText = task.title;

      const desc = document.createElement("div");
      desc.className = "task-desc";
      desc.innerText = task.description || "";

      const btn = document.createElement("button");
      btn.className = "task-btn";
      btn.innerText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";

      btn.addEventListener("click", async () => {
        btn.innerText = "⏳...";
        btn.disabled = true;

        try {
          const complete = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.telegramId, taskId: task._id })
          });
          const result = await complete.json();

          if (result.success) {
            btn.classList.add("done");
            btn.innerText = "✅ Done";
            updateCoins(result.newCoins);
            alert(`🎁 You earned ${task.reward} coins`);
          } else {
            btn.innerText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";
            btn.disabled = false;
            alert("❌ " + result.message);
          }
        } catch (err) {
          console.error("Task complete error:", err);
          btn.innerText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";
          btn.disabled = false;
          alert("Server error");
        }
      });

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(btn);
      taskList.appendChild(card);
    });

  } catch (err) {
    console.error("Tasks load error:", err);
    taskList.innerHTML = "<p>Failed to load tasks</p>";
  }
}

// ------------------ RUN ------------------
if (user) loginUser();
