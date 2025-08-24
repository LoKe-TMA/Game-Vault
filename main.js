/**
 * =================================================================
 * CORE INITIALIZATION
 * =================================================================
 */

// Telegram Web App object
const tg = window.Telegram.WebApp;

// API Base URL
const API_URL = "https://gamevault-backend-nf5g.onrender.com/api";

// လက်ရှိ login ဝင်ထားသော user ၏ data ကို သိမ်းရန်
let currentUser = null;


/**
 * =================================================================
 * API SERVICE
 * API call အားလုံးကို ဒီ function ကနေတစ်ဆင့် ခေါ်သုံးပါမယ်
 * =================================================================
 */
async function apiService(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
}


/**
 * =================================================================
 * UI & NAVIGATION
 * Page တွေ၊ UI element တွေကို ထိန်းချုပ်တဲ့အပိုင်း
 * =================================================================
 */

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active'); // Add null check
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`)?.classList.add('active'); // Add null check
}

function renderHomePage(user) {
  const homePage = document.getElementById("home");
  if (!homePage) return;
  homePage.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="profile">
      <h2>${user.firstName} ${user.lastName || ''}</h2>
      <p>@${user.username || 'N/A'}</p>
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

function updateCoinsDisplay(newCoinAmount) {
  const taskBalanceEl = document.getElementById("task-balance");
  if (taskBalanceEl) {
    taskBalanceEl.innerText = `Coins: ${newCoinAmount}`;
  }
  
  const homeCoinsEl = document.querySelector("#home .coins");
  if (homeCoinsEl) {
    homeCoinsEl.innerHTML = `💰 Coins: ${newCoinAmount}`;
  }
}

/**
 * =================================================================
 * AUTHENTICATION
 * =================================================================
 */
async function handleAuthentication() {
  try {
    const tgUser = tg.initDataUnsafe?.user;
    if (!tgUser) {
      throw new Error("Telegram user data not found.");
    }
    
    const loginPayload = {
      telegramId: tgUser.id,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      photoUrl: tgUser.photo_url
    };

    const data = await apiService('/auth/login', 'POST', loginPayload);

    if (data.success && data.user) {
      currentUser = data.user;
      renderHomePage(currentUser);
      updateCoinsDisplay(currentUser.coins);
      loadAndRenderTasks();
    } else {
      alert(`Login Failed: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Authentication failed:", error);
    alert(`An error occurred during login: ${error.message}`);
  }
}


/**
 * =================================================================
 * TASKS FEATURE (*** LATEST UPDATED SECTION ***)
 * =================================================================
 */

async function handleCompleteTask(taskId, taskReward, buttonElement) {
  buttonElement.innerText = "⏳...";
  buttonElement.disabled = true;

  try {
    const result = await apiService('/tasks/complete', 'POST', {
      userId: currentUser.telegramId, 
      taskId: taskId
    });

    if (result.success) {
      buttonElement.classList.add("done");
      buttonElement.innerText = "✅ Done";
      currentUser.coins = result.newCoins;
      updateCoinsDisplay(result.newCoins);
      alert(`🎁 You earned ${taskReward} coins`);
    } else {
      buttonElement.innerText = buttonElement.dataset.originalText;
      buttonElement.disabled = false;
      alert("❌ " + result.message);
    }
  } catch (error) {
    // This catch block handles network/server errors from apiService
    console.error("Task complete error:", error);
    buttonElement.innerText = buttonElement.dataset.originalText;
    buttonElement.disabled = false;
    alert("❌ An error occurred. Please try again.");
  }
}

async function loadAndRenderTasks() {
  const taskList = document.getElementById("task-list");
  // Defensive check: if element doesn't exist, do nothing.
  if (!taskList) return;
  
  taskList.innerHTML = "<p>Loading tasks...</p>";

  try {
    const tasks = await apiService("/tasks"); 
    
    // Robust check for empty or invalid data
    if (!Array.isArray(tasks) || tasks.length === 0) {
      taskList.innerHTML = "<p>No tasks available right now.</p>";
      return;
    }

    taskList.innerHTML = ""; // Clear loading message

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        const title = document.createElement("div");
        title.className = "task-title";
        title.innerText = task.title;

        const desc = document.createElement("div");
        desc.className = "task-desc";
        desc.innerText = task.description || ""; // Handle empty description

        const btn = document.createElement("button");
        btn.className = "task-btn";
        const btnText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";
        btn.innerText = btnText;
        btn.dataset.originalText = btnText;

        btn.addEventListener("click", () => {
          handleCompleteTask(task._id, task.reward, btn);
        });

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(btn);
        taskList.appendChild(card);
    });

  } catch (err) {
    console.error("Tasks load error:", err);
    taskList.innerHTML = "<p>Failed to load tasks. Please try again later.</p>";
