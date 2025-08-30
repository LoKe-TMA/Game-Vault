// frontend/app.js
import { renderNavbar } from "./components/navbar.js";
import { showHome } from "./pages/home.js";
import { showTasks } from "./pages/tasks.js";
import { showRefer } from "./pages/refer.js";
import { showOrders } from "./pages/orders.js";

const tg = window.Telegram.WebApp;
tg.expand(); // full height

let currentUser = null;

// Auto login
async function login() {
  const initData = tg.initData;
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData })
  });
  currentUser = await res.json();
  return currentUser;
}

function navigate(page) {
  const container = document.getElementById("page-content");
  if (page === "home") showHome(container, currentUser);
  if (page === "tasks") showTasks(container, currentUser);
  if (page === "refer") showRefer(container, currentUser);
  if (page === "orders") showOrders(container, currentUser);
}

// Init
(async function init() {
  await login();
  document.getElementById("loading").style.display = "none";
  document.getElementById("app").style.display = "block";

  renderNavbar("home", navigate);
  navigate("home");
})();

// frontend/main.js (listen to backend push or simulate)
function initNotifications() {
  // In real version: use WebSocket or Telegram Bot messages
  setInterval(() => {
    // Poll demo endpoint for notifications
    fetch(`http://localhost:5000/api/notifications/${window.user.telegramId}`)
      .then(r => r.json())
      .then(notifs => {
        notifs.forEach(n => showToast(n.message));
      });
  }, 5000);
}

