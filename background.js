chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleSidebar,
  });
});

function toggleSidebar() {
  const sidebar = document.querySelector('iframe[src^="chrome-extension://"]');
  if (sidebar) {
    sidebar.style.display = sidebar.style.display === "none" ? "block" : "none";
  } else {
    createSidebar();
  }
}

function createSidebar() {
  const sidebar = document.createElement("iframe");
  sidebar.src = chrome.runtime.getURL("sidebar.html");
  sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      height: 100%;
      z-index: 9999;
      border: none;
      box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    `;
  document.body.appendChild(sidebar);
}
