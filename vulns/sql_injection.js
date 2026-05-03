const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// In-memory sqlite vulnerable database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, balance INT)");
    db.run("INSERT INTO users VALUES (1, 'admin@bank.com', 'super_secure_p@ss', 999999)");
    db.run("INSERT INTO users VALUES (2, 'user@email.com', 'password', 8266)");
});

// Vulnerable Login Endpoint
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const level = req.body.level || 'low';

    console.log(`[+] Attempting login with Email: ${email}, Password: ${password}, Level: ${level}`);

    if (level === 'high') {
        // Secure Prepared Statement Simulation
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        db.get(query, [email, password], (err, row) => {
            if (row) return res.json({ success: true, message: "Normal login successful.", user: row });
            else return res.status(401).json({ success: false, message: "Invalid credentials. System Secure!" });
        });
        return;
    }

    if (level === 'medium') {
        if (password.includes('1=1') || password.includes(' ')) {
             return res.status(403).json({ success: false, message: "Security Filter Blocked suspicious payload." });
        }
    }

    // INTENTIONAL SQL INJECTION VULNERABILITY
    // ' OR 1=1--
    const query = `SELECT * FROM users WHERE username = '${email}' AND password = '${password}'`;
    
    db.get(query, (err, row) => {
        if (err) {
            console.error(err.message);
            // Crashing or returning a raw SQL error is a hallmark of SQLi
            return res.status(500).json({ error: "Database syntax error.", logs: err.message });
        }
        
        if (row) {
            // Check if they bypassed the password using SQLi
            if (password === "' OR 1=1--" || password.includes("OR 1=1")) {
                return res.json({ 
                    success: true, 
                    message: "Welcome back, we successfully bypassed authentication! flag{sqli_auth_bypass}",
                    user: row 
                });
            } else {
                return res.json({ 
                    success: true, 
                    message: "Normal login successful.",
                    user: row 
                });
            }
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });

});

module.exports = {
    id: "sqli-auth",
    name: "SQL Injection (Authentication Bypass)",
    category: "Web",
    difficulty: "Novice",
    theory: "SQL injection attacks occur when maliciously crafted inputs are submitted by an attacker, causing an application to perform an unintended action on the database. It allows attackers to spoof identity, tamper with existing data, or orchestrate administrative operations.",
    exploit: "Try logging in bypassing the password check. Submit Email: user@email.com and Password: ' or 1=1--",
    hint: "The database uses single quotes (') to interpret strings. Inject an apostrophe followed by an OR condition that evaluates to true, ending with a SQL comment (--).",
    whatToSolve: "Send a POST request to /api/vulns/sqli-auth/login with body: { email: 'user@email.com', password: \"' OR 1=1--\", level: 'low' }. The vulnerable SQL query becomes: SELECT * FROM users WHERE username = 'user@email.com' AND password = '' OR 1=1--' which always evaluates to true, bypassing authentication completely.",
    expectedOutput: "{ success: true, message: \"Welcome back, we successfully bypassed authentication! flag{sqli_auth_bypass}\", user: { id: 1, username: 'admin@bank.com', ... } }",
    mitigations: [
        "Use Parameterized Statements (Prepared Statements).",
        "Adopt Object Relational Mapping (ORM) frameworks correctly.",
        "Sanitize and validate inputs on the server-side."
    ],
    router: router
};
