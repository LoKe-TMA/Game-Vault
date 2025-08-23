document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.expand();
  const user = tg.initDataUnsafe.user;

  const dailyList = document.getElementById('daily-tasks');
  const specialList = document.getElementById('special-tasks');

  const DAILY_TASK_ID = 1;
  const DAILY_TASK_LIMIT = 10;

  async function initTasksPage() {
    if(!user) return;

    try {
      const res = await fetch('https://gamevault-backend-nf5g.onrender.com/api/tasks');
      const data = await res.json();
      if(data.success){
        // Daily Tasks
        data.dailyTasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.name} - Reward: ${task.coins} coins, ${task.spins} spins</span>
            <button class="daily-ad-btn">Watch Ad & Complete</button>
          `;
          dailyList.appendChild(li);
        });

        // Attach AdsGram button listener after elements exist
        const adButtons = document.querySelectorAll('.daily-ad-btn');
        adButtons.forEach((btn, index) => {
          const AdController = window.Adsgram.init({ blockId: "int-13300" }); // သင့် blockId ဖြည့်ပါ
          btn.addEventListener('click', () => {
            AdController.show()
              .then(() => completeTask(DAILY_TASK_ID))
              .catch(err => {
                alert('Ad not watched completely.');
                console.error(err);
              });
          });
        });

        // Special Tasks
        data.specialTasks.forEach(task => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.name} - Reward: ${task.coins} coins, ${task.spins} spins</span>
            <button class="special-btn" data-id="${task._id}">Complete</button>
          `;
          specialList.appendChild(li);
        });

        // Special Tasks listeners
        const specialBtns = document.querySelectorAll('.special-btn');
        specialBtns.forEach(btn => {
          btn.addEventListener('click', () => completeTask(btn.dataset.id));
        });

      }
    } catch(e){
      console.error("Error loading tasks:", e);
    }
  }

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
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch(err){
      console.error(err);
    }
  }

  initTasksPage();
});
