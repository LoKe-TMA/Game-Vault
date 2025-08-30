// frontend/components/navbar.js
export function renderNavbar(active, navigate) {
  const nav = document.getElementById("navbar");
  nav.className = "navbar";
  nav.innerHTML = `
    <button ${active==="home"?"style='color:#00ff99'":""}>Home</button>
    <button ${active==="tasks"?"style='color:#00ff99'":""}>Tasks</button>
    <button ${active==="refer"?"style='color:#00ff99'":""}>Refer</button>
    <button ${active==="orders"?"style='color:#00ff99'":""}>Orders</button>
  `;

  const buttons = nav.querySelectorAll("button");
  const pages = ["home", "tasks", "refer", "orders"];
  buttons.forEach((btn, i) => {
    btn.onclick = () => {
      renderNavbar(pages[i], navigate);
      navigate(pages[i]);
    };
  });
}
