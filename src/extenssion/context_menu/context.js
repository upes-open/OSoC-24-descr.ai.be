chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "bookmark") {
        const selectedText = request.selectionText;

        const bookmarkId = `bookmark-${Date.now()}`;

        chrome.storage.local.get({ bookmarks: [] }, (result) => {
            const bookmarks = result.bookmarks;
            bookmarks.push({ id: bookmarkId, text: selectedText, url: window.location.href });
            chrome.storage.local.set({ bookmarks });
        });

        alert(`Bookmarked: "${selectedText}"`);
    }
});
