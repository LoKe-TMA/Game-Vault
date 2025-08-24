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

// Tabs/Pages တွေပြောင်းဖို့
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Home Page ကို User data နဲ့ တည်ဆောက်ရန်
function renderHomePage(user) {
  const homePage = document.getElementById("home");
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

// Coin အရေအတွက်ကို UI မှာ update လုပ်ရန်
function updateCoinsDisplay(newCoinAmount) {
  // Task page မှာရှိတဲ့ coin display
  const taskBalanceEl = document.getElementById("task-balance");
  if (taskBalanceEl) {
    taskBalanceEl.innerText = `Coins: ${newCoinAmount}`;
  }
  
  // Home page မှာရှိတဲ့ coin display
  const homeCoinsEl = document.querySelector("#home .coins");
  if (homeCoinsEl) {
    homeCoinsEl.innerHTML = `💰 Coins: ${newCoinAmount}`;
  }
}

/**
 * =================================================================
 * AUTHENTICATION
 * Login/Register လုပ်ငန်းစဥ်များကို ကိုင်တွယ်ရန်
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
      
      // Tasks page ကို စတင်ပြင်ဆင်ပြီး tasks တွေကို load လုပ်မယ်
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
 * TASKS FEATURE (*** UPDATED SECTION ***)
 * Task page နှင့် သက်ဆိုင်သော logic များ
 * =================================================================
 */

// Task တစ်ခုကို complete လုပ်တဲ့အခါ ခေါ်ရန် function
async function handleCompleteTask(taskId, taskReward, buttonElement) {
  buttonElement.innerText = "⏳...";
  buttonElement.disabled = true;

  try {
    const result = await apiService('/tasks/complete', 'POST', {
      // User ပေးတဲ့ code မှာ userId သုံးထားတဲ့အတွက် ဒီမှာလည်း userId ကိုပဲသုံးပေးထား
      userId: currentUser.telegramId, 
      taskId: taskId
    });

    if (result.success) {
      buttonElement.classList.add("done");
      buttonElement.innerText = "✅ Done";
      
      // currentUser object ထဲက coin ကို update လုပ်
      currentUser.coins = result.newCoins;
      // UI မှာ coin အရေအတွက်ကို update လုပ်
      updateCoinsDisplay(result.newCoins);
      
      alert(`🎁 You earned ${taskReward} coins`);
    } else {
      // မအောင်မြင်ရင် button ကို မူလအတိုင်းပြန်ထား
      buttonElement.innerText = buttonElement.dataset.originalText; // မူလစာသားကို ပြန်သုံး
      buttonElement.disabled = false;
      alert("❌ " + result.message);
    }
  } catch (error) {
    buttonElement.innerText = buttonElement.dataset.originalText;
    buttonElement.disabled = false;
    alert("❌ " + error.message);
  }
}

// Tasks များကို Server မှခေါ်ယူပြီး UI မှာတည်ဆောက်ရန်
async function loadAndRenderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "<p>Loading tasks...</p>";

  try {
    // API ကနေ task list ကို တိုက်ရိုက် array နဲ့ ပြန်တယ်လို့ ယူဆ
    const tasks = await apiService("/tasks"); 
    taskList.innerHTML = ""; // Loading message ကိုရှင်း

    if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "task-card";

            const title = document.createElement("div");
            title.className = "task-title";
            title.innerText = task.title;

            const desc = document.createElement("div");
            desc.className = "task-desc";
            desc.innerText = task.description;

            const btn = document.createElement("button");
            btn.className = "task-btn";
            const btnText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";
            btn.innerText = btnText;
            btn.dataset.originalText = btnText; // မူလစာသားကို သိမ်းထား

            btn.addEventListener("click", () => {
              handleCompleteTask(task._id, task.reward, btn);
            });

            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(btn);
            taskList.appendChild(card);
        });
    } else {
        taskList.innerHTML = "<p>No tasks available right now.</p>";
    }

  } catch (err) {
    taskList.innerHTML = "<p>Failed to load tasks. Please try again later.</p>";
    console.error(err);
  }
}


/**
 * =================================================================
 * APPLICATION ENTRY POINT
 * Web App စတင်ချိန်မှာ ဒီကနေ အလုပ်လုပ်မယ်
 * =================================================================
 */
function initializeApp() {
  tg.expand();

  document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    handleAuthentication();
  });
}

// Application ကို စတင် run ပါ
initializeApp();
