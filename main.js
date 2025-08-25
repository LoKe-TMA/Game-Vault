document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  // Fake loading delay
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    app.classList.remove("hidden");
  }, 1500);

  // Navigation switching
  const navButtons = document.querySelectorAll("nav button");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      pages.forEach(p => p.classList.remove("active"));
      document.getElementById(`page-${target}`).classList.add("active");
    });
  });

  // Banner ads rotation (static for now)
  const ads = ["assets/ad1.png", "assets/ad2.png", "assets/ad3.png"];
  let currentAd = 0;
  const bannerImg = document.getElementById("banner-img");

  setInterval(() => {
    currentAd = (currentAd + 1) % ads.length;
    bannerImg.src = ads[currentAd];
  }, 10000);
});
