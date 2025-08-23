document.addEventListener("DOMContentLoaded", () => {
    console.log("Tasks page loaded");

    const tg = window.Telegram.WebApp;
    tg.expand();
    const user = tg.initDataUnsafe?.user;

    const dailyAdBtn = document.getElementById("daily-ad-btn");

    if (!window.Adsgram) {
        console.error("Adsgram SDK not loaded!");
        dailyAdBtn.disabled = true;
        return;
    }

    // ✅ Initialize AdsGram with your blockId
    const AdController = window.Adsgram.init({ blockId: "int-14145" });
    console.log("Adsgram initialized with blockId int-14145");

    dailyAdBtn.addEventListener("click", () => {
        console.log("Ad button clicked");

        AdController.show()
            .then(() => {
                console.log("Ad watched successfully ✅");

                // Reward user in backend
                fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegramId: user?.id, taskId: "daily-ad" })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("🎉 Reward added! Coins: " + data.user.coins);
                    } else {
                        alert("⚠️ Server error while adding reward");
                    }
                });
            })
            .catch(err => {
                console.error("Ad error:", err);
                alert("❌ Ad failed or closed");
            });
    });
});
