const express = require("express");
const router = express.Router();
const axios = require("axios");

module.exports = (db) => {
  router.post("/chat", (req, res) => {
    console.log("=== CHATBOT REQUEST ===");
    console.log("Body:", req.body);
    console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);
    console.log("GROQ KEY VALUE:", process.env.GROQ_API_KEY);

    const { message, coupleId } = req.body;

    if (!message || !coupleId) {
      console.log("Missing message or coupleId");
      return res
        .status(400)
        .json({ error: "Message and CoupleID are required" });
    }

    db.query(
      "SELECT Role, Genotype FROM person WHERE CoupleID = ?",
      [coupleId],
      async (err, rows) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ error: "Database error." });
        }

        console.log("Person rows found:", rows);

        const context = rows.length
          ? rows.map((r) => `${r.Role}: ${r.Genotype}`).join(", ")
          : "No genetic data found.";

        console.log("Context being sent to Groq:", context);

        try {
          const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: `You are the LebanonGen Genetic Assistant — a focused, empathetic, and knowledgeable specialist in genetic diseases, Sickle Cell Disease, and healthcare topics related to genetics and inherited conditions.

Patient Genotypes on file: ${context}.

YOUR STRICT SCOPE — you ONLY discuss:
- Sickle Cell Disease (SCD): symptoms, management, inheritance, genotypes (AA, AS, SS)
- Genetic diseases and inherited conditions (thalassemia, cystic fibrosis, hemophilia, etc.)
- Genetic counseling: risk percentages, family planning, carrier status
- Healthcare topics directly related to genetics: blood disorders, genotype testing, prenatal screening
- The patient's own genotype data if available in context

OUT OF SCOPE — if the user asks about anything unrelated (cooking, politics, coding, general trivia, relationships unrelated to health, etc.), respond with this exact pattern:
"I'm sorry, that's a bit outside my area of expertise! I'm specifically here to help with questions about Sickle Cell Disease, genetic conditions, and related healthcare topics. Is there anything in those areas I can help you with? 😊"

RESPONSE QUALITY RULES:
1. DYNAMIC LENGTH: Mirror the user's message length and tone. A simple "hi" gets a warm 1-2 sentence greeting. A detailed medical question gets a focused, thorough answer — never padding.
2. NATURAL FLOW: No rigid headers or templates. Write like a brilliant genetic counselor having a real conversation, not filling out a form.
3. PRECISION: When discussing risk percentages or genotype combinations, be numerically accurate. Use brief Markdown lists or **bold** only when it genuinely helps clarity.
4. EMPATHY FIRST: Many users may be anxious about their results. Lead with understanding before diving into clinical detail.
5. NO REPETITION: Never restate what the user just said back to them. Get straight to the helpful part.
6. NO DISCLAIMER: Do not add any medical disclaimer at the end of your messages.`,
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

          console.log("✅ Groq response received successfully");
          return res.json({ reply: response.data.choices[0].message.content });
        } catch (aiError) {
          // This will show the EXACT error Groq sends back
          console.error("❌ GROQ ERROR STATUS:", aiError.response?.status);
          console.error("❌ GROQ ERROR DATA:", aiError.response?.data);
          console.error("❌ GROQ ERROR MESSAGE:", aiError.message);

          // Send specific error message based on what went wrong
          const groqError = aiError.response?.data?.error?.message;
          return res.status(500).json({
            error: "AI service is temporarily unavailable.",
            details: groqError || aiError.message,
          });
        }
      },
    );
  });

  return router;
};
