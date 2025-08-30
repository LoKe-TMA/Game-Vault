// frontend/components/ui.js
export function showModal(title, content, onConfirm) {
  let modalBg = document.getElementById("modalBg");
  if (!modalBg) {
    modalBg = document.createElement("div");
    modalBg.id = "modalBg";
    modalBg.className = "modal-bg";
    document.body.appendChild(modalBg);
  }

  modalBg.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <div>${content}</div>
      <button id="modalConfirm">Confirm</button>
      <button id="modalClose">Cancel</button>
    </div>
  `;
  modalBg.style.display = "flex";

  document.getElementById("modalClose").onclick = () => modalBg.style.display = "none";
  document.getElementById("modalConfirm").onclick = () => {
    modalBg.style.display = "none";
    if (onConfirm) onConfirm();
  };
}

export function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 3000);
}
