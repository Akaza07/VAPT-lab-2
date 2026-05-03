const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'directory-traversal'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/\.\.\//i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(\.\.\/|%2f)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{directory-traversal_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "directory-traversal",
    name: "Directory Traversal",
    category: "Web",
    difficulty: "Varies",
    theory: "Directory (or Path) Traversal enables attackers to read arbitrary files on the system by manipulating URL path references usually with DOT-DOT-SLASH (../).",
    exploit: "Use `../` characters iteratively to reach the root system config.",
    hint: "Navigate back from /var/www/html/ using ../../../../etc/passwd",
    whatToSolve: "Send a POST request to /api/vulns/directory-traversal/execute with body: { payload: '../../../../etc/passwd', level: 'low' }. The server passes your input directly into a file path without sanitizing '../' sequences — chaining enough '../' segments lets you break out of the web root and read sensitive system files.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{directory-traversal_success}' }",
    mitigations: ["Use resolve() strictly verifying the base directory.","Strip ../ entirely from incoming params."],
    router: router
};
