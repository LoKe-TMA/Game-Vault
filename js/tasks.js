document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.expand();
  const user = tg.initDataUnsafe.user;

  const DAILY_TASK_ID = 1;

  // Daily Ad Button (static in HTML)
  const dailyAdBtn = document.getElementById("daily-ad-btn");
  if(dailyAdBtn){
    const AdController = window.Adsgram.init({ blockId: "int-13300" }); // သင့် blockId ဖြည့်ပါ
    dailyAdBtn.addEventListener("click", () => {
      AdController.show()
        .then(() => completeTask(DAILY_TASK_ID))
        .catch(err => {
          alert("Ad not watched completely.");
          console.error(err);
        });
    });
  }

  // Load Special Tasks from backend
  async function loadSpecialTasks(){
    try{
      const res = await fetch('https://gamevault-backend-nf5g.onrender.com/api/tasks');
      const data = await res.json();
      if(data.success){
        const specialList = document.getElementById('special-tasks');
        data.specialTasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.name} - Reward: ${task.coins} coins, ${task.spins} spins</span>
            <button class="special-btn" data-id="${task._id}">Complete</button>
          `;
          specialList.appendChild(li);
        });

        // Add click listeners for special tasks
        const specialBtns = document.querySelectorAll('.special-btn');
        specialBtns.forEach(btn => {
          btn.addEventListener('click', () => completeTask(btn.dataset.id));
        });
      }
    }catch(e){
      console.error("Error loading special tasks:", e);
    }
  }

  // Complete a task API call
  async function completeTask(taskId){
    try {
      const res = await fetch('https://gamevault-backend-nf5g.onrender.com/api/tasks/complete', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.id, taskId })
      });
      const data = await res.json();
      if(data.success){
        alert(`✅ Task completed! You earned ${data.reward.coins} coins and ${data.reward.spins} spins.`);

        // Update user's coins/spins in UI if elements exist
        const coinsEl = document.getElementById('coins');
        const spinsEl = document.getElementById('spins');
        if(coinsEl) coinsEl.innerText = data.user.coins;
        if(spinsEl) spinsEl.innerText = data.user.spins;

      } else {
        alert(`❌ ${data.message}`);
      }
    } catch(err){
      console.error(err);
      alert("Server error while completing task.");
    }
  }

  // Initialize page
  loadSpecialTasks();
});
