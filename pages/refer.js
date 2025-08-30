// frontend/pages/refer.js
export async function showRefer(container, user) {
  const res = await fetch(`http://localhost:5000/api/refer/${user.telegramId}`);
  const refer = await res.json();

  container.innerHTML = `
    <h2>👥 Refer & Earn</h2>
    <p>Referral Bonus: 100 Coins</p>
    <input id="refLink" value="${refer.referralLink}" readonly style="width:100%;"/>
    <button id="copyBtn">📋 Copy Link</button>
    <button id="shareBtn">📤 Share</button>
    <p>Total Friends: ${refer.referrals}</p>
    <p>💰 Earned Coins: ${refer.coins}</p>
  `;

  document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(refer.referralLink);
    alert("Copied!");
  };

  document.getElementById("shareBtn").onclick = () => {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(refer.referralLink)}`);
  };
}
