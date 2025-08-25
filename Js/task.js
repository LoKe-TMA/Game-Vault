// Daily Task Demo
const tasksSection = document.getElementById('tasks');

const tasks = [
  { name: "Watch Short Ad", max: 20, reward: 100 },
  { name: "Special Task: Join @GameVaultNews", max: 1, reward: 50 }
];

tasks.forEach(t => {
  const div = document.createElement('div');
  div.className = "task-card";
  div.innerHTML = `
    <div>${t.name}</div>
    <button class="do-task">Do Task</button>
  `;
  tasksSection.appendChild(div);
});

document.querySelectorAll('.do-task').forEach((btn, idx) => {
  let done = 0;
  btn.addEventListener('click', () => {
    const t = tasks[idx];
    if(done >= t.max) return alert('Task Completed');
    done++;
    alert(`You earned ${t.reward} Coins! (${done}/${t.max})`);
  });
});
