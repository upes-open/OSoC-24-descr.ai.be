import {
  addBookmark,
  getBookmark,
  getUserBookmarks,
  updateBookmark,
  deleteBookmark,
} from "../service/bookmarkService.js";

class BookmarkManager {
  constructor(userId) {
    this.userId = userId;
  }

  async addBookmark(bookmarkData) {
    try {
      const newBookmarkId = await addBookmark(this.userId, bookmarkData);
      console.log("New bookmark added with ID:", newBookmarkId);
      return newBookmarkId;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  }

  async getBookmark(bookmarkId) {
    try {
      const bookmark = await getBookmark(this.userId, bookmarkId);
      console.log("Retrieved bookmark:", bookmark);
      return bookmark;
    } catch (error) {
      console.error("Error getting bookmark:", error);
      throw error;
    }
  }

  async getAllBookmarks() {
    try {
      const userBookmarks = await getUserBookmarks(this.userId);
      console.log("User bookmarks:", userBookmarks);
      return userBookmarks;
    } catch (error) {
      console.error("Error getting all bookmarks:", error);
      throw error;
    }
  }

  async updateBookmark(bookmarkId, updatedData) {
    try {
      await updateBookmark(this.userId, bookmarkId, updatedData);
      console.log("Bookmark updated");
    } catch (error) {
      console.error("Error updating bookmark:", error);
      throw error;
    }
  }

  async deleteBookmark(bookmarkId) {
    try {
      await deleteBookmark(this.userId, bookmarkId);
      console.log("Bookmark deleted");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      throw error;
    }
  }
}

export default BookmarkManager;
