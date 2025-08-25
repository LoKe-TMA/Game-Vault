// Backend URL
const BACKEND_URL = "https://gamevault-backend-7vtc.onrender.com";

// Telegram Web App Initialize
const tg = window.Telegram.WebApp;
tg.expand(); // Fullscreen

// Telegram User Data
const userData = tg.initDataUnsafe?.user || {};
console.log("Telegram User:", userData);

// Demo banners
const banners = [
    { img: "assets/ad1.png", url: "https://example.com/ad1" },
    { img: "assets/ad2.png", url: "https://example.com/ad2" },
    { img: "assets/ad3.png", url: "https://example.com/ad3" },
];

let currentBanner = 0;

// Rotate Banner Ads
function rotateBanner() {
    const bannerImg = document.getElementById("banner-img");
    if (!bannerImg) return;
    bannerImg.src = banners[currentBanner].img;
    bannerImg.onclick = () => {
        window.open(banners[currentBanner].url, "_blank");
        console.log("Ad clicked:", banners[currentBanner].url);
    };
    currentBanner = (currentBanner + 1) % banners.length;
    setTimeout(rotateBanner, 10000); // every 10s
}

// Fetch Profile
function fetchProfile() {
    if (!userData.id) return;
    fetch(`${BACKEND_URL}/api/auth/profile/${userData.id}`)
        .then(res => res.json())
        .then(data => {
            console.log("Profile:", data);
            document.getElementById("profile-name").innerText = data.first_name + " " + (data.last_name || "");
            document.getElementById("profile-username").innerText = data.username ? "@" + data.username : "";
            document.getElementById("coin-balance").innerText = (data.coin_balance || 0) + " Coins";
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
            console.log("Login success:", data);
        })
        .catch(err => console.error("Login error:", err));
}

// Page Load Handler
window.addEventListener("load", () => {
    console.log("Page Loaded ✅");

    setTimeout(() => {
        const loadingPage = document.getElementById("loading");
        const homePage = document.getElementById("home");

        if (loadingPage && homePage) {
            loadingPage.classList.add("hidden");
            homePage.classList.remove("hidden");

            // Initialize app functions
            loginTelegram();
            fetchProfile();
            rotateBanner();
        } else {
            console.error("❌ Loading or Home element not found in HTML!");
        }
    }, 2000); // 2s loading
});

// Game Order Handlers
document.addEventListener("DOMContentLoaded", () => {
    const pubgBtn = document.getElementById("pubg-game");
    const mlbbBtn = document.getElementById("mlbb-game");

    if (pubgBtn) {
        pubgBtn.onclick = () => {
            const accountId = prompt("Enter your PUBG Account ID:");
            if (accountId) {
                alert(`PUBG UC order submitted for ID: ${accountId}`);
                // TODO: Call backend API
            }
        };
    }

    if (mlbbBtn) {
        mlbbBtn.onclick = () => {
            const accountId = prompt("Enter your MLBB Account ID:");
            const serverId = prompt("Enter your Server ID:");
            if (accountId && serverId) {
                alert(`MLBB Diamond order submitted for ID: ${accountId}, Server: ${serverId}`);
                // TODO: Call backend API
            }
        };
    }
});
;
