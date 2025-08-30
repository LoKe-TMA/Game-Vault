// frontend/pages/tasks.js
export function showTasks(container, user) {
  container.innerHTML = `
    <h2>📋 Daily Tasks</h2>
    <p>💰 Coins: <span id="coinBalance">${user.coins}</span></p>
    <button id="watchAd">▶️ Watch Ad</button>
    <p>Progress: <span id="progress">0/20</span></p>
    <div id="progressBar" style="background:#333;height:10px;">
      <div id="bar" style="background:#00ff99;width:0%;height:10px;"></div>
    </div>

    <h3>⭐ Special Tasks</h3>
    <p>Join our Telegram Channel for bonus!</p>
    <button id="joinTask">✅ Verify</button>
  `;

  let watched = 0;

  // AdsGram integration
  const AdController = window.Adsgram.init({ blockId: "int-13300" });
  document.getElementById("watchAd").onclick = () => {
    if (watched >= 20) return alert("Daily limit reached!");
    AdController.show().then(async () => {
      watched++;
      document.getElementById("progress").textContent = `${watched}/20`;
      document.getElementById("bar").style.width = `${(watched/20)*100}%`;

      const res = await fetch("http://localhost:5000/api/tasks/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.telegramId })
      });
      const data = await res.json();
      document.getElementById("coinBalance").textContent = data.totalCoins;
    });
  };

  document.getElementById("joinTask").onclick = () => {
    alert("Auto verification with Telegram SDK coming soon...");
  };
}
