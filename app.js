const telegramWebApp = window.Telegram.WebApp;
const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL

// Data for Games and Ads
const games = {
    'pubg': [
        { uc: 60, price: 4500 },
        { uc: 180, price: 13500 },
        // ... more
    ],
    'mlbb': [
        { item: 'Weekly Pass', diamond: 'Weekly Pass', price: 6500 },
        { item: '86 Diamonds', diamond: 86, price: 5500 },
        // ... more
    ]
};

const bannerAds = [
    { imageUrl: 'https://example.com/ad1.jpg', clickUrl: 'https://example.com' },
    { imageUrl: 'https://example.com/ad2.jpg', clickUrl: 'https://example.com' },
    { imageUrl: 'https://example.com/ad3.jpg', clickUrl: 'https://example.com' }
];

let userProfile = {};

// =======================
//     Helper Functions
// =======================

function showPopup(message) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupContent = document.getElementById('popup-content');
    popupContent.innerHTML = `<p>${message}</p><button onclick="hidePopup()">OK</button>`;
    popupOverlay.style.display = 'flex';
}

function hidePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}

async function fetchUserData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/${telegramWebApp.initDataUnsafe.user.id}`);
        const data = await response.json();
        if (response.ok) {
            userProfile = data.user;
            updateUI();
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

function updateUI() {
    document.getElementById('user-name').textContent = `Hello, ${userProfile.firstName}`;
    document.getElementById('coin-balance').textContent = `💰 ${userProfile.coinBalance} Coins`;
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${pageId.replace('-page', '')}-btn`).classList.add('active');
}

// =======================
//   Main App Logic
// =======================

document.addEventListener('DOMContentLoaded', async () => {
    telegramWebApp.ready();

    const userData = telegramWebApp.initDataUnsafe.user;
    const startPayload = telegramWebApp.initDataUnsafe.start_param;

    if (!userData) {
        alert("Failed to load user data. Please try again from Telegram.");
        return;
    }

    // Authenticate with Backend
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, start_payload: startPayload })
        });
        const data = await response.json();
        if (response.ok) {
            userProfile = data.user;
            updateUI();
            
            document.getElementById('loading-page').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';

            setupHomeContent();
            setupTasksContent();
            setupReferContent();
            setupOrderContent();
            setupNavigation();
            startBannerAdRotation();

        } else {
            showPopup(`Error: ${data.error}`);
        }
    } catch (error) {
        showPopup('Network Error. Please try again.');
        console.error(error);
    }
});

// =======================
//   Page-specific Code
// =======================

function setupHomeContent() {
    const homePage = document.getElementById('home-page');

    // PUBG Section
    const pubgList = games.pubg.map(g => `<li onclick="placeOrder('pubg', '${g.uc} UC', ${g.price})">${g.uc} UC = ${g.price} Coins</li>`).join('');
    homePage.innerHTML += `
        <h3>PUBG MOBILE: UC</h3>
        <ul class="game-list">${pubgList}</ul>
    `;
    
    // MLBB Section
    const mlbbList = games.mlbb.map(g => `<li onclick="placeOrder('mlbb', '${g.item}', ${g.price})">${g.item} = ${g.price} Coins</li>`).join('');
    homePage.innerHTML += `
        <h3>Mobile Legends: Diamond</h3>
        <ul class="game-list">${mlbbList}</ul>
    `;
}

async function placeOrder(game, item, price) {
    if (userProfile.coinBalance < price) {
        showPopup('❌ Insufficient coins to complete this order.');
        return;
    }

    let accountId = '';
    let serverId = '';

    if (game === 'pubg') {
        accountId = prompt(`Enter your PUBG Account ID:`);
    } else if (game === 'mlbb') {
        accountId = prompt(`Enter your MLBB Account ID:`);
        serverId = prompt(`Enter your MLBB Server ID:`);
    }

    if (!accountId) return;

    const confirmed = confirm(`Order: ${item} (${price} Coins)?`);
    if (!confirmed) return;

    try {
        const response = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: userProfile.telegramId, 
                orderType: game, 
                item, 
                price, 
                accountId, 
                serverId
            })
        });
        const data = await response.json();
        if (response.ok) {
            showPopup(`✅ Order Confirmed!`);
            userProfile.coinBalance = data.newBalance;
            updateUI();
        } else {
            showPopup(`❌ Order Failed: ${data.error}`);
        }
    } catch (error) {
        showPopup('Network error during order placement.');
    }
}

function setupTasksContent() {
    const tasksPage = document.getElementById('tasks-page');
    tasksPage.innerHTML = `
        <h3>Daily Tasks</h3>
        <p>Watch up to 20 ads per day.</p>
        <button id="watch-ad-btn">Watch Short Ad</button>
        <p>Ads Watched: <span id="ad-count">0</span>/20</p>
    `;
    document.getElementById('watch-ad-btn').addEventListener('click', watchAd);
}

const AdController = window.Adsgram.init({ blockId: "int-13300" });

async function watchAd() {
    AdController.show().then(async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/tasks/watch-ad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userProfile.telegramId })
            });
            const data = await response.json();
            if (response.ok) {
                userProfile.coinBalance = data.newBalance;
                updateUI();
                document.getElementById('ad-count').textContent = data.count;
                showPopup(`🎁 Task Reward Earned!`);
            } else {
                showPopup(`❌ Ad Task Failed: ${data.error}`);
            }
        } catch (error) {
            showPopup('Network error after watching ad.');
        }
    }).catch((result) => {
        showPopup(`Ad failed to load: ${JSON.stringify(result, null, 4)}`);
    });
}

function setupReferContent() {
    const referPage = document.getElementById('refer-page');
    const referralLink = `https://t.me/your_bot_username?start=ref_${userProfile.telegramId}`;
    referPage.innerHTML = `
        <h3>Invite Friends</h3>
        <p>Invite friends and get 100 Coins when they complete their first task.</p>
        <button id="invite-btn">Invite Friend</button>
        <button id="copy-btn">Copy Link</button>
    `;

    document.getElementById('invite-btn').addEventListener('click', () => {
        telegramWebApp.switchInlineQuery(referralLink);
    });
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => showPopup('Link copied!'))
            .catch(err => showPopup('Failed to copy link.'));
    });
}

function setupOrderContent() {
    const orderPage = document.getElementById('order-page');
    orderPage.innerHTML = '<h3>My Orders</h3><ul id="order-list"></ul>';
    fetchOrders();
}

async function fetchOrders() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/orders/${userProfile.telegramId}`);
        const data = await response.json();
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';
        if (response.ok && data.orders.length > 0) {
            data.orders.forEach(order => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${order.item}</strong> - ${order.price} Coins<br>
                    ID: ${order.accountId} | Status: <span class="status-${order.status.toLowerCase()}">${order.status}</span>
                `;
                orderList.appendChild(li);
            });
        } else {
            orderList.innerHTML = '<p>No orders yet.</p>';
        }
    } catch (error) {
        showPopup('Failed to fetch orders.');
    }
}


function startBannerAdRotation() {
    const bannerContainer = document.querySelector('.banner-ads');
    let currentAdIndex = 0;

    const rotateAd = () => {
        const ad = bannerAds[currentAdIndex];
        bannerContainer.innerHTML = `
            <a href="${ad.clickUrl}" target="_blank">
                <img src="${ad.imageUrl}" alt="Banner Ad" style="width: 100%; border-radius: 10px;">
            </a>
        `;
        currentAdIndex = (currentAdIndex + 1) % bannerAds.length;
    };

    rotateAd();
    setInterval(rotateAd, 10000); // Rotate every 10 seconds
}

function setupNavigation() {
    document.getElementById('home-btn').addEventListener('click', () => switchPage('home-page'));
    document.getElementById('tasks-btn').addEventListener('click', () => {
        switchPage('tasks-page');
        // Refresh task status on page load
    });
    document.getElementById('refer-btn').addEventListener('click', () => switchPage('refer-page'));
    document.getElementById('order-btn').addEventListener('click', () => {
        switchPage('order-page');
        fetchOrders(); // Refresh orders on page load
    });
}
