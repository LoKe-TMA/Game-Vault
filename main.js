const BACKEND_URL = "https://gamevault-backend-7vtc.onrender.com";

// Telegram Web App Initialize
const tg = window.Telegram.WebApp;
tg.expand(); // Fullscreen app

const userData = tg.initDataUnsafe.user;

// Demo banners (assets + click URL)
const banners = [
    { img: "assets/ad1.png", url: "https://example.com/ad1" },
    { img: "assets/ad2.png", url: "https://example.com/ad2" },
    { img: "assets/ad3.png", url: "https://example.com/ad3" },
];

let currentBanner = 0;

// Rotate Banner Ads every 10 seconds
function rotateBanner() {
    const bannerImg = document.getElementById("banner-img");
    bannerImg.src = banners[currentBanner].img;
    bannerImg.onclick = () => window.open(banners[currentBanner].url, "_blank");
    currentBanner = (currentBanner + 1) % banners.length;
}

setInterval(rotateBanner, 10000);

// Fetch Profile
function fetchProfile() {
    fetch(`${BACKEND_URL}/api/auth/profile/${userData.id}`)
      .then(res => res.json())
      .then(data => {
          document.getElementById("profile-name").innerText = data.first_name + " " + (data.last_name || "");
          document.getElementById("profile-username").innerText = data.username ? "@" + data.username : "";
          document.getElementById("coin-balance").innerText = data.coin_balance + " Coins";
          document.getElementById("profile-photo").src = data.photo_url || "default-avatar.png";
      });
}

// Telegram Login / Auto Register
function loginTelegram() {
    fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: tg.initData })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Logged in User:", data.user);
    });
}

// Show Home Page after loading
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("home").classList.remove("hidden");

        loginTelegram(); // auto register/login
        fetchProfile();  // show profile
        rotateBanner();  // start banner ads
    }, 2000); // simulate loading delay
});

// Game Click Handlers
document.getElementById("pubg-game").onclick = () => {
    alert("Selected PUBG MOBILE UC\nOrder flow will start here.");
};

document.getElementById("mlbb-game").onclick = () => {
    alert("Selected MLBB DIAMOND\nOrder flow will start here.");
};
