// frontend/pages/home.js (update with Game Store)
import { renderAds } from "../components/ads.js";

export function showHome(container, user) {
  container.innerHTML = `
    <h2>👋 Welcome, ${user.name}</h2>
    <p>💰 Coins: ${user.coins}</p>
    <div id="ads"></div>

    <h3>🎮 Games</h3>
    <button id="pubg">PUBG UC Store</button>
    <button id="mlbb">MLBB Diamond Store</button>
  `;

  renderAds("ads");

  document.getElementById("pubg").onclick = () => openStore("PUBG", user);
  document.getElementById("mlbb").onclick = () => openStore("MLBB", user);
}

function openStore(game, user) {
  const storeItems = game === "PUBG" ? [
    { name: "UC 60", coins: 4500 },
    { name: "UC 180", coins: 13500 },
    { name: "UC 325", coins: 21000 },
    { name: "UC 660", coins: 41000 },
    { name: "UC 1800", coins: 100000 }
  ] : [
    { name: "Weekly Pass", coins: 6500 },
    { name: "Diamond 86", coins: 5500 },
    { name: "Diamond 172", coins: 11000 },
    { name: "Diamond 706", coins: 43000 }
  ];

  let msg = `${game} Store\n\n`;
  storeItems.forEach((i, idx) => msg += `${idx+1}. ${i.name} - ${i.coins} coins\n`);
  const choice = prompt(msg + "\nEnter number:");
  if (!choice) return;
  const item = storeItems[choice-1];
  if (!item) return;

  const accountId = prompt("Enter Account ID:");
  let serverId = "";
  if (game === "MLBB") serverId = prompt("Enter Server ID:");

  fetch("http://localhost:5000/api/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId: user.telegramId,
      game,
      item: item.name,
      priceCoins: item.coins,
      accountId,
      serverId
    })
  }).then(r => r.json()).then(data => {
    if (data.error) return alert("❌ " + data.error);
    alert("✅ Order placed! Pending admin confirmation.");
  });
}
