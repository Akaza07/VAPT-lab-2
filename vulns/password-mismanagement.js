const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'password-mismanagement'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/collision/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(rainbow|match|crack)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{password-mismanagement_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "password-mismanagement",
    name: "Password Mismanagement",
    category: "Web",
    difficulty: "Varies",
    theory: "Storing passwords in plain text or using weak hashing algorithms (like MD5/SHA1) allows attackers database breaches to quickly become full account takeovers.",
    exploit: "Submit a reverse hash dictionary attack parameter to instantly crack a weak hash.",
    hint: "Provide an MD5 hash of 'password123': `cbfa20...` implying a rainbow table lookup.",
    whatToSolve: "Send a POST request to /api/vulns/password-mismanagement/execute with body: { payload: 'rainbow table match crack MD5', level: 'low' }. The database stores passwords as unsalted MD5 hashes — using a rainbow table lets you instantly find the plaintext for any hash. Include 'rainbow', 'match', or 'crack' in your payload to simulate a successful dictionary attack.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{password-mismanagement_success}' }",
    mitigations: ["Use strong iterative functions like Argon2, bcrypt, or scrypt.","Salt all passwords randomly."],
    router: router
};
