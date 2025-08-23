const tg = window.Telegram.WebApp;
tg.expand();
const user = tg.initDataUnsafe.user;

async function initTasksPage() {
  if(!user) return;

  const dailyList = document.getElementById('daily-tasks');
  const specialList = document.getElementById('special-tasks');

  try {
    const res = await fetch('https://gamevault-backend-nf5g.onrender.com/api/tasks');
    const data = await res.json();
    if(data.success) {
      // Daily Tasks
      data.dailyTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${task.name} - Reward: ${task.coin} coins, ${task.spin} spins</span>
          <button id="ad-btn-${task.id}">Watch Ad & Complete</button>
        `;
        dailyList.appendChild(li);

        // AdsGram integration
        const AdController = window.Adsgram.init({ blockId: "int-13300" }); // သင့် blockId ဖြည့်ပါ
        document.getElementById(`ad-btn-${task.id}`).addEventListener('click', () => {
          AdController.show()
            .then(() => {
              completeTask(task.id);
            })
            .catch(err => {
              alert('Ad not watched completely. Try again.');
              console.error(err);
            });
        });
      });

      // Special Tasks
      data.specialTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${task.name} - Reward: ${task.coin} coins, ${task.spin} spins</span>
          <button onclick="completeTask(${task.id})">Complete</button>
        `;
        specialList.appendChild(li);
      });
    }
  } catch(e) {
    console.error("Error loading tasks:", e);
  }
}

async function completeTask(taskId) {
  try {
    const res = await fetch('https://gamevault-backend-nf5g.onrender.com/api/tasks/complete', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: user.id, taskId })
    });
    const data = await res.json();
    if(data.success){
      alert(`✅ Task completed! You earned ${data.reward.coins} coins and ${data.reward.spins} spins.`);
      const coinsEl = document.getElementById('coins');
      if(coinsEl) coinsEl.innerText = data.user.coins;
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch(err){
    console.error(err);
  }
}

// Initialize Tasks Page
initTasksPage();
