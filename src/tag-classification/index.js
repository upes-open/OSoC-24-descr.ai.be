import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAGGFFsi64yOm93TypJeZrweUo23gCKw2M");

async function generateTags(url, title, summary, notes) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
      Given the following information about a bookmark, generate 5 relevant tags:
      URL: ${url}
      Title: ${title}
      Summary: ${summary}
      Notes: ${notes}
      
      Please provide the tags as a comma-separated list.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tags = response
      .text()
      .split(",")
      .map((tag) => tag.trim());
    return tags.slice(0, 5); // Ensure we only return up to 5 tags
  } catch (error) {
    console.error("Error generating tags with Gemini:", error);
    return []; // Return an empty array if there's an error
  }
}

export { generateTags };
