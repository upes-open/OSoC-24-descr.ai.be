import { generateTags } from "../tag-classification/index.js";
import {
  generateSummary,
  parseCustomJson,
} from "../text-summarization-model/index.js";
import BookmarkManager from "./bookmarkManager.js";

let bookmarkManager;

async function fetchLatestBookmarks() {
  try {
    const tags = await bookmarkManager.getTagCount();
    console.log(tags);
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

async function addNewBookmark(url, title, text, notes) {
  try {
    const summary = await generateSummary(`Homemade Pizza Recipe
Ingredients:
For the Dough:

2 ¼ tsp (1 packet) active dry yeast
1 ½ cups warm water (110°F or 45°C)
3 ½ to 4 cups all-purpose flour
2 tbsp olive oil
1 tsp sugar
2 tsp salt
For the Sauce:

1 can (15 oz) tomato sauce
1 can (6 oz) tomato paste
1-2 cloves garlic, minced
1 tsp dried oregano
1 tsp dried basil
1 tsp sugar
Salt and pepper to taste
For the Toppings:

2 cups shredded mozzarella cheese
Your choice of toppings (pepperoni, mushrooms, bell peppers, onions, olives, sausage, etc.)
Fresh basil leaves (optional)
Grated Parmesan cheese (optional)
Red pepper flakes (optional)
Instructions:
1. Prepare the Dough:

In a small bowl, dissolve the yeast and sugar in warm water. Let it sit for about 5 minutes until it becomes frothy.
In a large bowl, combine 3 ½ cups of flour and salt. Make a well in the center and add the yeast mixture and olive oil.
Mix until the dough comes together, then transfer to a floured surface and knead for about 8-10 minutes until smooth and elastic. Add more flour if necessary.
Place the dough in a greased bowl, cover with a damp cloth, and let it rise in a warm place for about 1 to 1 ½ hours, or until doubled in size.
2. Prepare the Sauce:

In a medium bowl, combine the tomato sauce, tomato paste, minced garlic, oregano, basil, sugar, salt, and pepper. Mix well and set aside.
3. Assemble the Pizza:

Preheat your oven to 475°F (245°C). If you have a pizza stone, place it in the oven to preheat as well.
Punch down the dough and divide it into two equal pieces. Roll each piece into a ball and let them rest for about 10 minutes.
On a floured surface, roll out one dough ball into a 12-inch circle. Transfer the rolled-out dough to a pizza peel or an inverted baking sheet lined with parchment paper.
Spread half of the pizza sauce over the dough, leaving a small border around the edges.
Sprinkle 1 cup of shredded mozzarella cheese over the sauce.
Add your desired toppings evenly over the cheese.
4. Bake the Pizza:

Carefully slide the pizza onto the preheated pizza stone or place the baking sheet in the oven.
Bake for 12-15 minutes, or until the crust is golden brown and the cheese is bubbly and slightly browned.
Remove the pizza from the oven and let it cool for a couple of minutes before slicing.
`);

    const jsonSummary = await parseCustomJson(summary);
    const tags = await generateTags(url, title, jsonSummary.long, notes);
    const newBookmarkId = await bookmarkManager.addBookmark({
      url,
      title,
      summary: jsonSummary,
      keywords: tags,
      notes: notes !== undefined ? notes : "",
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
