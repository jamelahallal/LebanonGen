require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function simpleTest() {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY) {
        console.log("ERROR: No API key found in .env file");
        console.log("Create a .env file with: GEMINI_API_KEY=your_key_here");
        return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        const response = result.response;
        console.log("SUCCESS! Response:", response.text());
    } catch (error) {
        console.log("FAILED!");
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
        console.log("Error status:", error.status);
        console.log("Full error:", JSON.stringify(error, null, 2));
    }
}

simpleTest();