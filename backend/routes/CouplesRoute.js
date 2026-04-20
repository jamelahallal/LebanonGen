const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = (db) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 1. AI CHATBOT ROUTE
  router.post("/ai-chat", async (req, res) => {
    const { coupleId, message } = req.body;

    if (!coupleId)
      return res.status(400).json({ reply: "Please log in first." });

    const sql = "SELECT Role, Genotype FROM person WHERE CoupleID = ?";

    db.execute(sql, [coupleId], async (err, results) => {
      if (err) return res.status(500).json({ reply: "Database error." });

      const context = results.length
        ? results.map((r) => `${r.Role}: ${r.Genotype}`).join(", ")
        : "No genetic data provided yet.";

      try {
        // FIX: Use 'gemini-pro' as it has the highest compatibility with the v1beta endpoint
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a genetic counselor. Context: ${context}. Question: ${message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return res.status(200).json({ reply: text });
      } catch (error) {
        console.error("AI ERROR:", error.message);

        // If 'gemini-pro' also fails, we'll give you a clear descriptive error
        return res.status(500).json({
          reply:
            "I'm having trouble accessing my model. Error: " + error.message,
        });
      }
    });
  });

  // 2. LOGIN
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

  // 3. REGISTER
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

  // 4. SAVE DATA
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
