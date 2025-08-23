const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

let banners = ["assets/banner1.png", "assets/banner2.png", "assets/banner3.png"];
let currentBanner = 0;

function rotateBanner() {
  const bannerImg = document.getElementById("banner-img");
  if (bannerImg) {
    bannerImg.src = banners[currentBanner];
    currentBanner = (currentBanner + 1) % banners.length;
  }
}
setInterval(rotateBanner, 10000);
rotateBanner();

// Tabs switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add("active");
  });
});

// Login + fetch user
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
    document.getElementById("user-coins").innerText = `${data.user.coins} Coins`;
    initPackages();
  }
}

// Sample package list
const pubgPackages = [
  { id: 1, name: "60 UC", price: 4300 },
  { id: 2, name: "180 UC", price: 12000 }
];
const mlbbPackages = [
  { id: 1, name: "Weekly Pass", price: 5000 },
  { id: 2, name: "86 Diamonds", price: 6000 }
];

function initPackages() {
  const pubgDiv = document.getElementById("pubg-packages");
  const mlbbDiv = document.getElementById("mlbb-packages");

  pubgDiv.innerHTML = pubgPackages.map(p =>
    `<div class="game-card">
      <h4>${p.name}</h4>
      <button class="game-btn" onclick="orderPackage('pubg', ${p.id})">${p.price} Coins</button>
    </div>`
  ).join("");

  mlbbDiv.innerHTML = mlbbPackages.map(p =>
    `<div class="game-card">
      <h4>${p.name}</h4>
      <button class="game-btn" onclick="orderPackage('mlbb', ${p.id})">${p.price} Coins</button>
    </div>`
  ).join("");
}

// Order modal
function orderPackage(game, id) {
  const modal = document.getElementById("order-modal");
  modal.style.display = "flex";
  document.getElementById("package-id").value = id;
  document.getElementById("package-game").value = game;
}

document.querySelectorAll(".close-modal").forEach(btn =>
  btn.addEventListener("click", () => {
    document.getElementById("order-modal").style.display = "none";
  })
);

// Toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 3000);
}

if (user) loginUser();
