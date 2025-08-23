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
    // Init pages
    initStorePage(data.user);
    initSpinPage(data.user);
    initTasksPage(data.user);
    initReferPage(data.user);
    initOrdersPage(data.user);
  }
}

// ---------------- Tasks Page ----------------
function initTasksPage(user) {
  const tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = `
    <h2>📋 Daily Tasks</h2>
    <div class="ads">
      <p>Watch Short Ad (10/day limit)</p>
      <button id="ad" class="game-btn">Watch Ad</button>
      <div id="task-msg"></div>
    </div>
  `;

  const AdController = window.Adsgram.init({ blockId: "int-14145" });

  document.getElementById("ad").addEventListener("click", async () => {
    const start = Date.now();

    try {
      await AdController.show();
      const elapsed = (Date.now() - start) / 1000;

      if (elapsed >= 15) {
        // Backend API call to reward coins
        const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/reward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId: user.id, coinsEarned: 10 }) // example: 10 coins per ad
        });

        const data = await res.json();
        if (data.success) {
          user.coins = data.coins;
          document.getElementById("task-msg").innerText = `✅ You earned 10 coins! Total: ${data.coins}`;
          const coinsEl = document.querySelector(".coins");
          if (coinsEl) coinsEl.innerText = `💰 ${data.coins} Coins`;
        }
      } else {
        document.getElementById("task-msg").innerText = "⚠️ You closed ad too early, no reward.";
      }
    } catch (err) {
      alert("Ad error: " + JSON.stringify(err));
    }
  });
}

// Init other pages (placeholders)
function initStorePage(user) { /* Store logic */ }
function initSpinPage(user) { /* Spin logic */ }
function initReferPage(user) { /* Refer logic */ }
function initOrdersPage(user) { /* Orders logic */ }

// Login on load
if(user) loginUser();
