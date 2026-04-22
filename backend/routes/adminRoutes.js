// adminRoutes.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/doctor-login", (req, res) => {
    const { email, password, role } = req.body;
    const sql =
      "SELECT * FROM doctor WHERE Email = ? AND Password = ? AND Role = ?";

    db.query(sql, [email, password, role], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        res.json({
          token: "session_id_123",
          role: results[0].Role,
          name: results[0].Name,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials or role" });
      }
    });
  });

  // SHARED: Regional Analytics (For Researchers & Admins)
  router.get("/region-stats", (req, res) => {
    const sql = `
      SELECT r.Name, 
      SUM(CASE WHEN p.Genotype = 'Carrier' THEN 1 ELSE 0 END) as carriers,
      SUM(CASE WHEN p.Genotype = 'Infected' THEN 1 ELSE 0 END) as infected
      FROM region r
      LEFT JOIN person p ON r.RegionID = p.RegionID
      GROUP BY r.RegionID`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // CONSULTANT: Review assessments
  router.get("/assessments", (req, res) => {
    const sql = `
      SELECT a.*, c.Email 
      FROM assessment a 
      JOIN couple c ON a.CoupleID = c.CoupleID 
      ORDER BY a.CreatedAt DESC`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // ADMIN: Oversight of doctors and couples
  router.get("/users-overview", (req, res) => {
    const sql = `
      SELECT 'doctor' as type, Name, Email, Role FROM doctor
      UNION
      SELECT 'couple' as type, NULL as Name, Email, NULL as Role FROM couple`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  router.delete("/delete-user/:email", (req, res) => {
    const { email } = req.params;

    const deleteDoctor = "DELETE FROM doctor WHERE Email = ?";
    const deleteCouple = "DELETE FROM couple WHERE Email = ?";

    db.query(deleteDoctor, [email], (err) => {
      if (err) return res.status(500).json(err);

      db.query(deleteCouple, [email], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "User deleted successfully" });
      });
    });
  });

  return router;
};
