const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

// Tabs logic
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// Auto login & fetch user
async function loginUser() {
  try {
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
      renderHome(data.user);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
}

// Render Home Page
function renderHome(user) {
  const homeDiv = document.getElementById("home");
  homeDiv.innerHTML = `
    <div class="profile">
      <img src="${user.photoUrl || 'assets/default.png'}" alt="Profile">
      <h2>${user.firstName || ''} ${user.lastName || ''}</h2>
      <div class="coins">💰 ${user.coins} Coins</div>
    </div>
  `;
}

// Run login when Telegram user exists
if (user) loginUser();
