// frontend/pages/orders.js
export async function showOrders(container, user) {
  const res = await fetch(`http://localhost:5000/api/orders/my/${user.telegramId}`);
  const orders = await res.json();

  container.innerHTML = "<h2>📦 My Orders</h2>";

  if (!orders.length) {
    container.innerHTML += "<p>No orders yet.</p>";
    return;
  }

  orders.forEach(o => {
    let statusIcon = "⏳";
    if (o.status === "confirmed") statusIcon = "✅";
    if (o.status === "rejected") statusIcon = "❌";

    container.innerHTML += `
      <div style="border:1px solid #333;padding:10px;margin:5px;">
        ${statusIcon} ${o.game} - ${o.item}<br/>
        Coins: ${o.priceCoins}<br/>
        Account: ${o.accountId} ${o.serverId || ""}
      </div>
    `;
  });
}
