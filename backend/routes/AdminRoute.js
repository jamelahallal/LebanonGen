const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Doctor/Admin Login Route
    router.post('/doctor-login', (req, res) => {
        const { email, password, role } = req.body;

        const query = 'SELECT * FROM doctor WHERE Email = ? AND Password = ? AND Role = ?';
        
        db.execute(query, [email, password, role], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (results.length > 0) {
                res.status(200).json({ 
                    message: 'Staff login successful', 
                    role: results[0].Role,
                    name: results[0].Name 
                });
            } else {
                res.status(401).json({ message: 'Invalid staff credentials or role' });
            }
        });
    });

    // CRITICAL: You must return the router!
    return router; 
};