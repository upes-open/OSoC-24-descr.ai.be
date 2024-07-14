import BookmarkManager from "./bookmarkManager.js";

let bookmarkManager;

async function fetchLatestBookmarks() {
  try {
    const allBookmarks = await bookmarkManager.getAllBookmarks();
    const sortedBookmarks = allBookmarks.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    // Return only the top 3
    return sortedBookmarks.slice(0, 3);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

function renderBookmarks(bookmarks) {
  const bookmarkList = document.getElementById("latest-bookmarks");
  bookmarkList.innerHTML = ""; // Clear existing bookmarks

  bookmarks.forEach((bookmark) => {
    const li = document.createElement("li");
    li.className = "bookmark-item";
    li.textContent = bookmark.title;
    li.setAttribute("data-url", bookmark.url);
    bookmarkList.appendChild(li);
  });
}

async function initBookmarks() {
  const latestBookmarks = await fetchLatestBookmarks();
  renderBookmarks(latestBookmarks);
}

async function addNewBookmark(url, title) {
  try {
    const newBookmarkId = await bookmarkManager.addBookmark({
      url,
      title,
      timestamp: Date.now(),
    });
    await initBookmarks();
    return newBookmarkId;
  } catch (error) {
    console.error("Error adding new bookmark:", error);
  }
}

document.querySelector(".add-bookmark-btn").addEventListener("click", () => {
  const url = prompt("Enter the URL of the bookmark:");
  const title = prompt("Enter the title of the bookmark:");
  if (url && title) {
    addNewBookmark(url, title);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get the user ID from your authentication system
  const userId = "user123";
  bookmarkManager = new BookmarkManager(userId);
  initBookmarks();
});
