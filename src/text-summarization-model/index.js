import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { readFileSync } from "fs";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const parseCustomJson = async (text) => {
  try {
    const trimmedText = text.trim();

    // Check if the text starts and ends with triple backticks
    if (trimmedText.startsWith("```json") && trimmedText.endsWith("```")) {
      // Extract the JSON content between the backticks
      const jsonContent = trimmedText.slice(7, -3).trim();
      // Parse the JSON content
      return JSON.parse(jsonContent);
    } else {
      throw new Error("Input is not properly formatted as a JSON code block");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
};

const generateSummary = async (text, images) => {
  if (text === undefined || text === "") return;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "Summarize the given text and images(if provided) and return back in JSON format, it must have 2 properties, a 'short': 1 line summary of content and a 'long': detailed summary of content\n";

  let imageParts = [];

  if (images !== undefined) {
    for (let image of images) {
      imageParts.push(fileToGenerativePart(image, "image/png"));
    }
  }

  const input = prompt + text;
  const result = await model.generateContent([input, ...imageParts]);
  const response = result.response;
  const summary = response.text();
  //   console.log(summary);
  return summary;
};

//
// const summary = generateSummary(" ", ["image.png"]);
const summary =
  '```json { "short": "Scientists have discovered a new species of orangutans in Sumatra, Indonesia, called the Tapanuli orangutan, which is considered the most endangered of all great apes.","long": "Scientists have discovered a new species of orangutans in the Batang Toru forest of North Sumatra, Indonesia.  The Tapanuli orangutan is distinct from the other two species of orangutans found in Sumatra and Borneo due to genetic, skeletal, and tooth differences.  With fewer than 800 individuals, the Tapanuli orangutan is considered the most endangered great ape species.  The population is highly vulnerable due to habitat destruction from development and faces an immediate threat of extinction within our lifetime.  The research began in 2013 when an injured orangutan was found in the area, leading to the examination of its skull and subsequent discovery of the new species." } ```';
parseCustomJson(summary)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
