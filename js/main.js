const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;
const pageContainer = document.getElementById('page-container');

// Load any page dynamically
function loadPage(page) {
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      pageContainer.innerHTML = html;

      // Set active tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.tab[onclick="loadPage('${page}')"]`).classList.add('active');

      // Initialize page
      initPage(page);
    });
}

// Initialize content per page
async function initPage(page) {
  if(!user) return;

  // Fetch user from backend DB
  let dbUser = { coins: 100 }; // fallback
  try {
    const res = await fetch(`https://gamevault-backend-nf5g.onrender.com/api/auth/${user.id}`);
    const data = await res.json();
    if(data.success) dbUser = data.user;
  } catch(e) {
    console.error("Error fetching user from backend:", e);
  }

  if(page === 'store') {
    document.getElementById('profile-img').src = user.photo_url || 'assets/default.png';
    document.getElementById('profile-name').innerText = user.username || user.first_name;
    document.getElementById('coins').innerText = dbUser.coins;
  }

  if(page === 'spin') {
    document.getElementById('spin-coins').innerText = dbUser.coins;
    document.getElementById('spin-count').innerText = dbUser.spins || 0;
  }
}

// Auto load store page
loadPage('store');
