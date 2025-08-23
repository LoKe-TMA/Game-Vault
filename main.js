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
      renderProfile(data.user);
    } else {
      alert("Login Failed ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
}

// Render Profile on Home Page
function renderProfile(user) {
  const homePage = document.getElementById("home");
  homePage.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="profile">
      <h2>${user.firstName} ${user.lastName || ''}</h2>
      <p>@${user.username || ''}</p>
      <div class="coins">💰 Coins: ${user.coins}</div>
    </div>
  `;
}

// Run auto login
if (user) loginUser();
