import {
  generateSummary,
  parseCustomJson,
} from "../text-summarization-model/index.js";
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

async function addNewBookmark(url, title, text) {
  try {
    const summary =
      await generateSummary(`Scientists say they have discovered a new species of orangutans on Indonesia’s island of Sumatra.
The population differs in several ways from the two existing orangutan species found in Sumatra and the neighboring island of Borneo.
The orangutans were found inside North Sumatra’s Batang Toru forest, the science publication Current Biology reported.
Researchers named the new species the Tapanuli orangutan. They say the animals are considered a new species because of genetic, skeletal and tooth differences.
Michael Kruetzen is a geneticist with the University of Zurich who has studied the orangutans for several years. He said he was excited to be part of the unusual discovery of a new great ape in the present day. He noted that most great apes are currently considered endangered or severely endangered.
Gorillas, chimpanzees and bonobos also belong to the great ape species.
Orangutan – which means person of the forest in the Indonesian and Malay languages - is the world’s biggest tree-living mammal. The orange-haired animals can move easily among the trees because their arms are longer than their legs. They live more lonely lives than other great apes, spending a lot of time sleeping and eating fruit in the forest.`);

    const jsonSummary = await parseCustomJson(summary);
    const newBookmarkId = await bookmarkManager.addBookmark({
      url,
      summary: jsonSummary,
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
