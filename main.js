// Backend URL
const BACKEND_URL = "https://gamevault-backend-7vtc.onrender.com";

// Telegram Web App Initialize
const tg = window.Telegram.WebApp;
tg.expand(); // Fullscreen app

// Telegram User Data
const userData = tg.initDataUnsafe.user;
console.log("Telegram User:", userData);

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

// Fetch Profile from Backend
function fetchProfile() {
    fetch(`${BACKEND_URL}/api/auth/profile/${userData.id}`)
      .then(res => res.json())
      .then(data => {
          document.getElementById("profile-name").innerText = data.first_name + " " + (data.last_name || "");
          document.getElementById("profile-username").innerText = data.username ? "@" + data.username : "";
          document.getElementById("coin-balance").innerText = data.coin_balance + " Coins";
          document.getElementById("profile-photo").src = data.photo_url || "default-avatar.png";
      })
      .catch(err => console.error("Profile fetch error:", err));
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
    })
    .catch(err => console.error("Login error:", err));
}

// Show Home Page after loading
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("home").classList.remove("hidden");

        loginTelegram(); // auto register/login
        fetchProfile();  // display profile
        rotateBanner();  // start banner rotation
    }, 2000); // simulate loading delay
});

// Game Click Handlers
document.getElementById("pubg-game").onclick = () => {
    const order = prompt("Enter your PUBG Account ID for order:");
    if(order) {
        alert(`PUBG UC order submitted for ID: ${order}`);
        // TODO: call backend API to create order & deduct coins
    }
};

document.getElementById("mlbb-game").onclick = () => {
    const orderId = prompt("Enter your MLBB Account ID:");
    const serverId = prompt("Enter Server ID:");
    if(orderId && serverId) {
        alert(`MLBB Diamond order submitted for ID: ${orderId}, Server: ${serverId}`);
        // TODO: call backend API to create order & deduct coins
    }
};
