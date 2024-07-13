// bookmarkService.js
const { db } = require("../firebaseConfig");
const {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} = require("firebase/firestore");

const COLLECTION_NAME = "bookmarks";

// Create a new bookmark for a user
async function addBookmark(userId, bookmark) {
  try {
    const bookmarkWithUser = { ...bookmark, userId };
    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      bookmarkWithUser
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding bookmark: ", error);
    throw error;
  }
}

// Read a bookmark by ID and user ID
async function getBookmark(userId, bookmarkId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, bookmarkId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === userId) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting bookmark: ", error);
    throw error;
  }
}

// Get all bookmarks for a user
async function getUserBookmarks(userId) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user bookmarks: ", error);
    throw error;
  }
}

// Update a bookmark for a user
async function updateBookmark(userId, bookmarkId, updatedData) {
  try {
    const docRef = doc(db, COLLECTION_NAME, bookmarkId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === userId) {
      await updateDoc(docRef, updatedData);
      return true;
    } else {
      throw new Error("Bookmark not found or user doesn't have permission");
    }
  } catch (error) {
    console.error("Error updating bookmark: ", error);
    throw error;
  }
}

// Delete a bookmark for a user
async function deleteBookmark(userId, bookmarkId) {
  try {
    const docRef = doc(db, COLLECTION_NAME, bookmarkId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === userId) {
      await deleteDoc(docRef);
      return true;
    } else {
      throw new Error("Bookmark not found or user doesn't have permission");
    }
  } catch (error) {
    console.error("Error deleting bookmark: ", error);
    throw error;
  }
}

module.exports = {
  addBookmark,
  getBookmark,
  getUserBookmarks,
  updateBookmark,
  deleteBookmark,
};
