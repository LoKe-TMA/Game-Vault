document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  // Show dashboard after fake loading
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    app.classList.remove("hidden");
  }, 1500);

  // Navigation
  const navButtons = document.querySelectorAll("nav button");
  const pages = document.querySelectorAll(".page");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pages.forEach(p => p.classList.remove("active"));
      document.getElementById(`page-${btn.dataset.page}`).classList.add("active");
    });
  });

  // Banner Ads (static rotation)
  const ads = [
    { img: "https://i.imgur.com/ad1.png", link: "https://partner1.com" },
    { img: "https://i.imgur.com/ad2.png", link: "https://partner2.com" },
    { img: "https://i.imgur.com/ad3.png", link: "https://partner3.com" },
  ];
  let currentAd = 0;
  const bannerImg = document.getElementById("banner-img");

  function showAd(index) {
    bannerImg.src = ads[index].img;
    bannerImg.onclick = () => window.open(ads[index].link, "_blank");
  }

  showAd(currentAd);
  setInterval(() => {
    currentAd = (currentAd + 1) % ads.length;
    showAd(currentAd);
  }, 10000);
});
