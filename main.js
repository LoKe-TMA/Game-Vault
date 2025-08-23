let user = { id: "demoUser123" }; // Telegram User ID ကို backend မှာယူပါ

// Page switcher
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";

  if (pageId === "tasks") {
    initTasksPage(user);
  }
}

// --- Tasks Page ---
function initTasksPage(user) {
  const tasksDiv = document.getElementById("tasks");

  tasksDiv.innerHTML = `
    <h2>📋 Today's Ad Tasks</h2>
    <div class="task-summary">
      <p><strong>Total Tasks:</strong> <span id="totalTasks">45</span></p>
      <p><strong>Completed:</strong> <span id="completedTasks">0</span></p>
      <p><strong>Remaining:</strong> <span id="remainingTasks">45</span></p>
      <div class="progress-bar">
        <div id="progressFill" class="progress-fill" style="width: 0%">0%</div>
      </div>
      <button class="start-btn" onclick="startAdTask()">▶ Start Task</button>
    </div>

    <h2>📢 Channel Join Tasks</h2>
    <div class="join-task">
      <p>✅ Join our <a href="https://t.me/exampleChannel1" target="_blank">Channel 1</a></p>
      <button onclick="completeJoinTask('channel1')">Confirm</button>
    </div>
    <div class="join-task">
      <p>✅ Join our <a href="https://t.me/exampleChannel2" target="_blank">Channel 2</a></p>
      <button onclick="completeJoinTask('channel2')">Confirm</button>
    </div>
  `;
}

// --- Ad Task ---
let completed = 0;
let total = 45;

function startAdTask() {
  alert("🎬 Ad is playing... Please wait 15 sec!");

  setTimeout(async () => {
    completed++;
    updateTaskProgress();

    // ✅ Update coins from backend
    await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId: user.id,
        taskType: "ad"
      })
    });

    alert("✅ Task completed! Coins added.");
  }, 15000);
}

function updateTaskProgress() {
  let remaining = total - completed;
  let percent = Math.round((completed / total) * 100);

  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("remainingTasks").innerText = remaining;
  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressFill").innerText = percent + "%";
}

// --- Channel Join Task ---
async function completeJoinTask(channelId) {
  await fetch("https://gamevault-backend-nf5g.onrender.com/api/tasks/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId: user.id,
      taskType: "join",
      channel: channelId
    })
  });

  alert("🎉 Channel join confirmed! Coins rewarded.");
}

// Default open page
showPage("store");
