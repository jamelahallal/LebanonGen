require("dotenv").config();
const axios = require("axios");

async function run() {
  try {
    const res = await axios.get(
      "https://generativelanguage.googleapis.com/v1/models",
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      },
    );

    console.log("AVAILABLE MODELS:\n");

    res.data.models.forEach((m) => {
      console.log("NAME:", m.name);
      console.log("METHODS:", m.supportedGenerationMethods);
      console.log("-----");
    });
  } catch (err) {
    console.log("ERROR:");
    console.log(err.response?.data || err.message);
  }
}

run();
