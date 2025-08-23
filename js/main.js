const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;
const pageContainer = document.getElementById('page-container');

// Load other pages
function loadPage(page) {
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      pageContainer.innerHTML = html;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.tab[onclick="loadPage('${page}')"]`).classList.add('active');
      initPage(page);
    });
}

// Store page loader
function loadStore() {
  pageContainer.innerHTML = document.querySelector('#page-container').innerHTML; // Keep store content
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab').classList.add('active');
  initStore();
}

// Initialize store page
function initStore() {
  if(!user) return;
  document.getElementById('profile-img').src = user.photo_url || 'assets/default.png';
  document.getElementById('profile-name').innerText = user.username || user.first_name;
  document.getElementById('coins').innerText = 100; // Starting coins
}

// Initialize other pages
function initPage(page) {
  if(page === 'spin') {
    document.getElementById('spin-coins').innerText = 100;
    document.getElementById('spin-count').innerText = 0;
  }
  // Tasks / Refer / Orders can be initialized similarly
}

// Auto load store on page load
loadStore();
