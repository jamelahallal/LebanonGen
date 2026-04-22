const express = require("express");
const router = express.Router();
const axios = require("axios");

module.exports = (db) => {
  // 1. AI CHATBOT ROUTE
  router.post("/ai-chat", async (req, res) => {
    const { coupleId, message } = req.body;

    if (!coupleId)
      return res.status(400).json({ reply: "Please log in first." });

    // Fetching the genetic data from your 'person' table
    const sql = "SELECT Role, Genotype FROM person WHERE CoupleID = ?";

    db.execute(sql, [coupleId], async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ reply: "Database error." });
      }

      // Format context so the AI knows exactly who is who
      const context = results.length
        ? results.map((r) => `${r.Role} Genotype: ${r.Genotype}`).join(", ")
        : "No genetic data provided yet for this couple.";

      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are a professional genetic counselor for LebanonGen.
                
                PATIENT CONTEXT: ${context}. 

                STRICT RESPONSE GUIDELINES:
                1. NEVER write long paragraphs. 
                2. Use Bullet Points for all risks and recommendations.
                3. Use **Bold Text** for genotypes and percentages (e.g., **25% chance**).
                4. Use Markdown headers (e.g., ### Risk Assessment) to organize sections.
                5. If genotypes are missing, politely ask them to update their profile.
                6. Explain the inheritance of Sickle Cell Anemia based on their specific context.
                7. ALWAYS end with a medical disclaimer stating this is AI guidance and they must see a doctor.`,
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

        const aiReply = response.data.choices[0].message.content;
        return res.status(200).json({ reply: aiReply });
      } catch (error) {
        console.error("GROQ AI ERROR:", error.response?.data || error.message);
        return res.status(500).json({
          reply: "The AI is currently unavailable. Please try again later.",
        });
      }
    });
  });

  // 2. LOGIN (Keeping your existing logic)
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM couple WHERE Email = ? AND Password = ?";

    db.execute(query, [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) {
        return res.status(200).json({
          message: "Login successful",
          user: { id: results[0].CoupleID, email: results[0].Email },
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    });
  });

  // 3. REGISTER (Keeping your existing logic)
  router.post("/register", (req, res) => {
    const { email, password } = req.body;
    const checkUser = "SELECT * FROM couple WHERE Email = ?";

    db.execute(checkUser, [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0)
        return res.status(400).json({ message: "Email already registered" });

      const query = "INSERT INTO couple (Email, Password) VALUES (?, ?)";
      db.execute(query, [email, password], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      });
    });
  });

  // 4. SAVE DATA (Keeping your existing logic)
  router.post("/save-couple-data", (req, res) => {
    const { coupleId, persons } = req.body;
    const query = `
      INSERT INTO person 
      (CoupleID, Role, FullName, Genotype, BloodType, RhFactor) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      FullName = VALUES(FullName),
      Genotype = VALUES(Genotype)
    `;

    let completed = 0;
    if (!persons || persons.length === 0)
      return res.status(400).json({ message: "No data to save" });

    persons.forEach((person) => {
      db.execute(
        query,
        [
          coupleId,
          person.role,
          person.fullName,
          person.genotype,
          person.bloodType,
          person.rhFactor,
        ],
        (err) => {
          completed++;
          if (completed === persons.length) {
            return res.status(200).json({ message: "Sync successful" });
          }
        },
      );
    });
  });

  return router;
};
