const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Database");
});

// User Registration Route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User registered successfully" });
    });
});

// User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({success:true, message: "Login successful", token });
    });
});



app.post("/org-login", async (req, res) => {
    const { email, password_hash } = req.body;
    const sql = "SELECT * FROM organizations WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({success:true, message: "Login successful", token });
    });
});

app.post("/org-register", async (req, res) => {
    const {name, legal_name, industry, organization_size, email, phone, website, address, business_type, registration_number,
        tax_id, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO organizations (name, legal_name, industry, organization_size, email, phone, website, address, business_type, registration_number,
     tax_id, password_hash)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(sql, [name, legal_name, industry, organization_size, email, phone, website, address, business_type, registration_number,
        tax_id, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting organization:", err);
        res.status(500).json({ message: "Database error" });
      } else {
        res.json({ message: "Organization registered successfully", status: "success" });
      }
    });
  });

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
