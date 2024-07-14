const {
  addBookmark,
  getBookmark,
  getUserBookmarks,
  updateBookmark,
  deleteBookmark,
} = require("../service/bookmarkService.js");

async function exampleUsage() {
  const userId = "user123";

  try {
    const newBookmarkId = await addBookmark(userId, {
      url: "https://exampl2.com",
      title: "Example Bookmark 2",
      summary: "This is an example bookmark",
      keywords: ["example", "bookmark"],
      notes: "Some additional notes",
    });
    console.log("New bookmark added with ID:", newBookmarkId);

    // Get the bookmark for the user
    const bookmark = await getBookmark(userId, newBookmarkId);
    console.log("Retrieved bookmark:", bookmark);

    // Get all bookmarks for the user
    const userBookmarks = await getUserBookmarks(userId);
    console.log("User bookmarks:", userBookmarks);

    // Update the bookmark for the user
    // await updateBookmark(userId, newBookmarkId, {
    //   title: "Updated Example Bookmark",
    // });
    console.log("Bookmark updated");

    // Delete the bookmark for the user
    // await deleteBookmark(userId, newBookmarkId);
    console.log("Bookmark deleted");
  } catch (error) {
    console.error("Error:", error);
  }
}

exampleUsage();
