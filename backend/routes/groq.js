const express = require("express");
const router = express.Router();
const axios = require("axios");

module.exports = (db) => {
  router.post("/chat", async (req, res) => {
    const { message, coupleId } = req.body;

    if (!message || !coupleId) {
      return res
        .status(400)
        .json({ error: "Message and CoupleID are required" });
    }

    try {
      // Use await directly (assumes db is a promise-based connection)
      // If using callbacks, use: const [rows] = await db.execute(...)
      const [rows] = await db.query(
        "SELECT Role, Genotype FROM person WHERE CoupleID = ?",
        [coupleId],
      );

      const context = rows.length
        ? rows.map((r) => `${r.Role}: ${r.Genotype}`).join(", ")
        : "No genetic data found.";

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are the LebanonGen Genetic Assistant. 
              Patient Genotypes: ${context}. 
              Rules: 
              1. Use Bullet points.
              2. Be empathetic but scientific. 
              3. Explain Sickle Cell inheritance. 
              4. ALWAYS include a medical disclaimer.`,
            },
            { role: "user", content: message },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
      console.error("AI ROUTE ERROR:", error.message);
      res.status(500).json({ error: "AI service is temporarily unavailable." });
    }
  });

  return router;
};
