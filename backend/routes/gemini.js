const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: text });
  } catch (error) {
    console.log("=== GEMINI FULL ERROR ===");
    console.log(error.response?.data);
    console.log(error.message);
    console.log(error);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
