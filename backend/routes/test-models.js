require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = await genAI.listModels();

    console.log("AVAILABLE MODELS:");
    console.log(models);
  } catch (err) {
    console.log("ERROR:");
    console.log(err);
  }
}

checkModels();
