require("dotenv").config();
const axios = require("axios");

async function listModels() {
  try {
    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1/models",
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      },
    );

    console.log("AVAILABLE MODELS:\n");

    response.data.models.forEach((m) => {
      console.log("Name:", m.name);
      console.log("Methods:", m.supportedGenerationMethods);
      console.log("-----");
    });
  } catch (error) {
    console.log("ERROR:");
    console.log(error.response?.data || error.message);
  }
}

listModels();
