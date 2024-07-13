chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bookmark",
        title: "Bookmark this text \"%s\"",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bookmark") {
        chrome.tabs.sendMessage(tab.id, {
            action: "bookmark",
            selectionText: info.selectionText
        });
    }
});
