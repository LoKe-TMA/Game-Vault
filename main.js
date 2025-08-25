document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  // show loading for 2s then switch to dashboard
  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = "none";
    if (app) app.style.display = "block";
  }, 2000);

  // Navigation
  const navButtons = document.querySelectorAll("nav button");
  const pages = document.querySelectorAll(".page");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pages.forEach(p => p.classList.remove("active"));
      document.getElementById(`page-${btn.dataset.page}`).classList.add("active");
    });
  });

  // Banner Ads (rotation)
  const ads = [
    { img: "https://i.imgur.com/xxxxx.png", link: "https://partner1.com" },
    { img: "https://i.imgur.com/yyyyy.png", link: "https://partner2.com" },
    { img: "https://i.imgur.com/zzzzz.png", link: "https://partner3.com" },
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
