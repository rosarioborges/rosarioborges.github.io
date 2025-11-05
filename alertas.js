// ======= alertas.js =======
(function(){
  const container = document.createElement("div");
  container.className = "alert-container";
  document.body.appendChild(container);

  // Cria alerta (toast)
  function showAlert(msg, type = "info", timeout = 4000) {
    const toast = document.createElement("div");
    toast.className = `site-toast ${type}`;
    toast.innerHTML = `<span>${msg}</span> <button class="close">&times;</button>`;
    container.appendChild(toast);

    const close = toast.querySelector(".close");
    close.onclick = () => toast.remove();
    setTimeout(() => toast.remove(), timeout);
  }

  // Substitui alert()
  window.alert = (msg) => showAlert(msg, "info");
  // Substitui confirm()
  window.confirm = (msg) => {
    showAlert(msg, "warn");
    console.warn("⚠️ confirm() mostrado visualmente — retorno automático: false");
    return false;
  };
  // Substitui prompt()
  window.prompt = (msg) => {
    showAlert(msg, "warn");
    console.warn("⚠️ prompt() mostrado visualmente — retorno automático: null");
    return null;
  };

  // Exporta
  window.showAlert = showAlert;
})();
