import {
  addBookmark,
  getBookmark,
  getUserBookmarks,
  updateBookmark,
  deleteBookmark,
} from "../service/bookmarkService.js";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from "../firebaseConfig.js";

const COLLECTION_NAME = "bookmarks";

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

  async getAllTags() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", this.userId)
      );
      const querySnapshot = await getDocs(q);

      // Use a Set to store unique tags
      const tagSet = new Set();

      querySnapshot.forEach((doc) => {
        const bookmark = doc.data();
        if (bookmark.keywords && Array.isArray(bookmark.keywords)) {
          bookmark.keywords.forEach((tag) => tagSet.add(tag));
        }
      });

      // Convert Set to Array and sort alphabetically
      const allTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

      return allTags;
    } catch (error) {
      console.error("Error fetching all tags:", error);
      throw error;
    }
  }

  async getTagCount() {
    try {
      const allTags = await this.getAllTags();
      const tagCount = {};

      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", this.userId)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const bookmark = doc.data();
        if (bookmark.keywords && Array.isArray(bookmark.keywords)) {
          bookmark.keywords.forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        }
      });

      return allTags.map((tag) => ({ tag, count: tagCount[tag] || 0 }));
    } catch (error) {
      console.error("Error getting tag count:", error);
      throw error;
    }
  }
}

export default BookmarkManager;
