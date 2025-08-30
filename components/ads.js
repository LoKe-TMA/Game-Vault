// frontend/components/ads.js
let currentIndex = 0;
let ads = [];

export async function renderAds(containerId) {
  const res = await fetchhttps://gamevault-backend-fkzs.onrender.com/api/ads");
  ads = await res.json();
  if (!ads.length) return;

  const container = document.getElementById(containerId);
  showAd(container);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % ads.length;
    showAd(container);
  }, 10000); // rotate every 10s
}

function showAd(container) {
  const ad = ads[currentIndex];
  container.innerHTML = `
    <a href="${ad.clickUrl}" target="_blank">
      <img src="${ad.imageUrl}" width="100%" />
    </a>
  `;

  // Track clicks
  container.querySelector("a").onclick = async () => {
    await fetch(`https://gamevault-backend-fkzs.onrender.com/api/ads/${ad._id}/click`, { method: "PATCH" });
  };
}
