document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  // Telegram SDK
  const tg = window.Telegram.WebApp;
  tg.expand();

  const user = tg.initDataUnsafe?.user;

  if (user) {
    console.log("Logged in as:", user);

    // Auto Login/Register to backend
    fetch("https://gamevault-backend-fkzs.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        photoUrl: user.photo_url
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Login success:", data);

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Show profile in dashboard
          document.getElementById("profile-name").innerText =
            data.user.firstName + " " + (data.user.lastName || "");
          document.getElementById("profile-id").innerText =
            "@" + (data.user.username || "unknown");
          document.getElementById("coin-balance").innerText =
            data.user.coins + " Coins";
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch(err => console.error("Login error:", err));
  } else {
    console.error("Telegram User not found!");
  }

  // show loading first then dashboard
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
      document
        .getElementById(`page-${btn.dataset.page}`)
        .classList.add("active");
    });
  });

  // Banner Ads rotation
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

  if (bannerImg) {
    showAd(currentAd);
    setInterval(() => {
      currentAd = (currentAd + 1) % ads.length;
      showAd(currentAd);
    }, 10000);
  }
});
