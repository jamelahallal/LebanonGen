const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini once
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

module.exports = (db) => {

    // =========================
    // 1. LOGIN
    // =========================
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        const query = 'SELECT * FROM Couple WHERE Email = ? AND Password = ?';

        db.execute(query, [email, password], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: results[0].CoupleID,
                        email: results[0].Email
                    }
                });
            }

            return res.status(401).json({ message: 'Invalid email or password' });
        });
    });

    // =========================
    // 2. REGISTER
    // =========================
    router.post('/register', (req, res) => {
        const { email, password } = req.body;

        const checkUser = 'SELECT * FROM Couple WHERE Email = ?';

        db.execute(checkUser, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const query = 'INSERT INTO Couple (Email, Password) VALUES (?, ?)';

            db.execute(query, [email, password], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                return res.status(201).json({
                    message: 'User registered successfully'
                });
            });
        });
    });

    // =========================
    // 3. SAVE COUPLE DATA
    // =========================
    router.post('/save-couple-data', (req, res) => {
        const { coupleId, persons } = req.body;

        if (!coupleId || !persons) {
            return res.status(400).json({ message: "Invalid data." });
        }

        const query = `
            INSERT INTO Person 
            (CoupleID, RegionID, Role, FullName, DateOfBirth, Gender, BloodType, RhFactor, Genotype, FamilyHistory, HasAffectedChild) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            RegionID = VALUES(RegionID),
            FullName = VALUES(FullName),
            DateOfBirth = VALUES(DateOfBirth),
            Gender = VALUES(Gender),
            BloodType = VALUES(BloodType),
            RhFactor = VALUES(RhFactor),
            Genotype = VALUES(Genotype),
            FamilyHistory = VALUES(FamilyHistory),
            HasAffectedChild = VALUES(HasAffectedChild)
        `;

        let completed = 0;
        let hasError = false;

        persons.forEach((person) => {

            const values = [
                coupleId,
                person.region ? parseInt(person.region) : null,
                person.role,
                person.fullName,
                person.dob || null,
                person.gender || null,
                person.bloodType,
                person.rhFactor,
                person.genotype,
                person.familyHistory,
                person.hasAffectedChild
            ];

            db.execute(query, values, (err) => {
                if (err) hasError = true;

                completed++;

                if (completed === persons.length) {
                    if (hasError) {
                        return res.status(500).json({ message: "Error syncing data." });
                    }

                    return res.status(200).json({
                        message: "Data updated successfully!"
                    });
                }
            });
        });
    });

    // =========================
    // 4. AI CHATBOT (FIXED)
    // =========================
    router.post('/ai-chat', (req, res) => {
        const { coupleId, message } = req.body;

        if (!coupleId) {
            return res.status(400).json({
                reply: "Please log in first."
            });
        }

        const query = `
            SELECT FullName, Role, Genotype, BloodType, RhFactor 
            FROM person 
            WHERE CoupleID = ?`;

        db.execute(query, [coupleId], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    reply: "Database error."
                });
            }

            const context = results.length
                ? results.map(p =>
                    `${p.Role} (${p.FullName}): Genotype ${p.Genotype}, Blood ${p.BloodType}${p.RhFactor}`
                  ).join(". ")
                : "No genetic data found for this couple.";

            try {
                const prompt = `
You are a helpful genetic counselor.

Patient Data:
${context}

User Question:
${message}

Answer briefly and clearly.
                `;

                const result = await ai.models.generateContent({
                   model: "gemini-1.5-flash-001",
                    contents: prompt,
                });

                return res.status(200).json({
                    reply: result.text
                });

            } catch (error) {
                console.error("GEMINI ERROR:", error.message);

                return res.status(500).json({
                    reply: "AI error: " + error.message
                });
            }
        });
    });

    return router;
};