document.addEventListener("DOMContentLoaded", () => {
    console.log("Tasks JS Loaded");

    const dailyAdBtn = document.getElementById("daily-ad-btn");
    if(!dailyAdBtn){
        console.error("Daily Ad Button not found!");
        return;
    }

    console.log("Daily Ad Button found");

    try {
        const AdController = window.Adsgram.init({ blockId: "int-13300" });
        console.log("AdsGram initialized");

        dailyAdBtn.addEventListener("click", () => {
            console.log("Daily Ad Button clicked");
            AdController.show()
                .then(() => {
                    console.log("Ad watched completely");
                    alert("✅ You earned reward!");
                })
                .catch(err => {
                    console.error("Ad error:", err);
                    alert("❌ Ad not watched completely");
                });
        });
    } catch(e) {
        console.error("AdsGram init error:", e);
    }
});
