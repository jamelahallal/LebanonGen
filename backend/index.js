const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // ✅ MOVED HERE - Load environment variables FIRST
const coupleRoutes = require('./routes/CouplesRoute'); 
const adminRoutes = require('./routes/AdminRoute'); 

const app = express();
app.use(cors());
app.use(express.json());

// Debug: Check if API key is loaded
console.log('=== Environment Check ===');
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('API Key first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10));
console.log('=======================');

// 1. Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'lebanongene'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// 2. Use Routes
app.use('/api', coupleRoutes(db));
app.use('/api/admin', adminRoutes(db)); 

// 3. Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
