/**
 * =================================================================
 * CORE INITIALIZATION
 * =================================================================
 */

// Telegram Web App object
const tg = window.Telegram.WebApp;

// API Base URL - တစ်နေရာတည်းမှာပဲ သတ်မှတ်ထားတယ်
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
      // Server က error message ပါလာရင် အဲ့ဒါကို ပြမယ်
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    // error ကို ထပ်ပစ်ပေးလိုက် عشان ခေါ်တဲ့နေရာမှာ catch လုပ်လို့ရအောင်
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
  // Page အားလုံးကို အရင်ဖျောက်
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // ရွေးလိုက်တဲ့ page ကိုပြ
  document.getElementById(pageId).classList.add('active');

  // Tab အားလုံးက active class ကို အရင်ဖြုတ်
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  // ရွေးလိုက်တဲ့ tab မှာ active class ထည့်
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


/**
 * =================================================================
 * AUTHENTICATION
 * Login/Register လုပ်ငန်းစဥ်များကို ကိုင်တွယ်ရန်
 * =================================================================
 */
async function handleAuthentication() {
  try {
    const tgUser = tg.initDataUnsafe?.user;

    // Telegram user data မရှိရင် အလုပ်မလုပ်တော့ဘူး
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
      currentUser = data.user; // User data ကိုသိမ်း
      renderHomePage(currentUser);
      initializeTasksPage(currentUser); // Tasks page ကိုလည်း data နဲ့ ပြင်ဆင်
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
 * TASKS FEATURE
 * Task page နှင့် သက်ဆိုင်သော logic များ
 * =================================================================
 */

// Task page ကို စတင်ပြင်ဆင်ရန်
async function initTasksPage(user) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "<p>Loading tasks...</p>";

  try {
    const res = await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks");
    const data = await res.json();

    taskList.innerHTML = "";

    data.forEach(task => {
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
      btn.innerText = task.type === "ad" ? "▶ Watch Ad" : "📢 Join";

      btn.addEventListener("click", async () => {
        btn.innerText = "⏳...";
        btn.disabled = true;

        // API Call to complete task
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
      });

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(btn);
      taskList.appendChild(card);
    });

  } catch (err) {
    taskList.innerHTML = "<p>Failed to load tasks</p>";
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
  tg.expand(); // Web app ကို screen အပြည့်ချဲ့

  // HTML document load ဖြစ်ပြီးမှ အလုပ်လုပ်စေရန်
  document.addEventListener('DOMContentLoaded', () => {
    showPage('home'); // ပထမဆုံး home page ကိုပြ
    handleAuthentication(); // User login/register လုပ်ငန်းစဥ်ကို စတင်
  });
}

// Application ကို စတင် run ပါ
initializeApp();
