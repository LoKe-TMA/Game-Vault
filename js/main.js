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
function initPage(page) {
  if(!user) return;

  if(page === 'store') {
    document.getElementById('profile-img').src = user.photo_url || 'assets/default.png';
    document.getElementById('profile-name').innerText = user.username || user.first_name;
    document.getElementById('coins').innerText = 100; // Starting coins
  }

  if(page === 'spin') {
    document.getElementById('spin-coins').innerText = 100;
    document.getElementById('spin-count').innerText = 0;
  }

  if(page === 'tasks') {
    // Tasks init
  }

  if(page === 'refer') {
    // Refer init
  }

  if(page === 'orders') {
    // Orders init
  }
}

// Auto load store page
loadPage('store');
