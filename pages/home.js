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

// frontend/pages/home.js (update openStore)
import { showModal, showToast } from "../components/ui.js";

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

  let listHtml = storeItems.map((i, idx) =>
    `<div class="card">
       <p>${i.name} - ${i.coins} coins</p>
       <button onclick="chooseItem(${idx})">Buy</button>
     </div>`
  ).join("");

  document.getElementById("app").innerHTML = `<h2>${game} Store</h2>${listHtml}`;

  window.chooseItem = (idx) => {
    const item = storeItems[idx];
    let content = `
      <input id="accountId" placeholder="Account ID" style="width:100%;margin:5px;"/>
      ${game === "MLBB" ? '<input id="serverId" placeholder="Server ID" style="width:100%;margin:5px;"/>' : ''}
    `;
    showModal(`Buy ${item.name}`, content, async () => {
      const accountId = document.getElementById("accountId").value;
      const serverId = game === "MLBB" ? document.getElementById("serverId").value : "";

      const res = await fetch("https://gamevault-backend-fkzs.onrender.com/api/orders/create", {
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
      });
      const data = await res.json();
      if (data.error) return showToast("❌ " + data.error);
      showToast("✅ Order placed!");
    });
  };
}

