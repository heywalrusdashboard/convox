(function () {
  const currentScript = document.currentScript;
  const get = (key, fallback = "") =>
    currentScript?.getAttribute(`data-${key}`)?.trim() || fallback;

  const params = new URLSearchParams({
    user_id: get("user_id"),
    primaryColor: get("primaryColor", "#0675E6"),
    secondaryColor: get("secondaryColor", "#FFFFFF"),
    fontFamily: get("fontFamily", "Poppins, sans-serif"),
    widgetWidth: get("widgetWidth", ""),
    companionName: get("companionName", "Companion"),
  });

  const widgetURL = `https://convox-pink.vercel.app/chat-widget?${params.toString()}`;
  // const widgetURL = `http://localhost:5174/chat-widget?${params.toString()}`;

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.bottom = "30px";
  wrapper.style.right = "12px";
  wrapper.style.width = window.innerWidth < 640 ? "90vw" : "370px";
  wrapper.style.height = "725px";
  wrapper.style.display = "none";
  wrapper.style.zIndex = "9998";

  window.addEventListener("resize", () => {
    wrapper.style.width = window.innerWidth < 640 ? "90vw" : "370px";
  });

  const iframe = document.createElement("iframe");
  iframe.src = widgetURL;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.background = "transparent";

  wrapper.appendChild(iframe);
  document.body.appendChild(wrapper);

  // --- Chat and Close Icons ---
  const chatIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path fill="#ffffff" d="M8 7H16V9H8V7Z" />
      <path fill="#ffffff" d="M14 11H8V13H14V11Z" />
      <path fill="#ffffff" d="M19.2 3C20.19 3 20.99 3.81 20.99 4.8L21 21L17.4 17.4H4.8C3.81 17.4 3 16.59 3 15.6V4.8C3 3.81 3.81 3 4.8 3H19.2Z" />
    </svg>
  `;

  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" width="24" viewBox="0 0 24 24">
      <path stroke="#fff" stroke-width="2" d="M6 6L18 18M6 18L18 6" />
    </svg>
  `;

  const toggleBtn = document.createElement("div");
  toggleBtn.style.position = "fixed";
  toggleBtn.style.bottom = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.width = "60px";
  toggleBtn.style.height = "60px";
  toggleBtn.style.borderRadius = "50%";
  toggleBtn.style.backgroundColor = get("primaryColor", "#0675E6");
  toggleBtn.style.color = "#fff";
  toggleBtn.style.display = "flex";
  toggleBtn.style.alignItems = "center";
  toggleBtn.style.justifyContent = "center";
  toggleBtn.style.fontSize = "24px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.zIndex = "9999";
  toggleBtn.innerHTML = chatIcon;

  let isOpen = false;
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    wrapper.style.display = isOpen ? "block" : "none";
    toggleBtn.innerHTML = isOpen ? closeIcon : chatIcon;
    iframe.contentWindow.postMessage(isOpen ? "openChat" : "closeChat", "*");
  });

  document.body.appendChild(toggleBtn);
})();
