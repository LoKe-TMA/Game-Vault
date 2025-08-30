// frontend/pages/home.js
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

  document.getElementById("pubg").onclick = () => {
    alert("PUBG UC Store coming soon...");
  };
  document.getElementById("mlbb").onclick = () => {
    alert("MLBB Diamond Store coming soon...");
  };
}
