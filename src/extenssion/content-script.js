let sidebar = null;

function createSidebar() {
  if (sidebar) return;

  sidebar = document.createElement("iframe");
  sidebar.src = chrome.runtime.getURL("sidebar.html");
  sidebar.style.cssText = `
        position: fixed;
        top: 0;
        right: -400px;
        width: 470px;
        height: 100%;
        z-index: 9999;
        border: none;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        transition: right 0.3s ease-in-out;
    `;
  document.body.appendChild(sidebar);

  setTimeout(() => {
    sidebar.style.right = "0";
  }, 50);
}

function removeSidebar() {
  if (sidebar) {
    sidebar.style.right = "-300px";
    setTimeout(() => {
      sidebar.remove();
      sidebar = null;
    }, 300);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSidebar") {
    if (sidebar) {
      removeSidebar();
    } else {
      createSidebar();
    }
  }
});
