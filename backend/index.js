const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const coupleRoutes = require("./routes/CouplesRoute");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Change this if you have a MySQL password
  database: "lebanongene",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    process.exit(1); // Stop the script if DB is not running
  }
  console.log("✅ Connected to the MySQL database.");
});

app.use("/api", coupleRoutes(db));

// 3. Keep the Server Alive
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 SERVER IS LIVE AT: http://localhost:${PORT}`);
  console.log("   Press Ctrl + C to stop the server");
});
