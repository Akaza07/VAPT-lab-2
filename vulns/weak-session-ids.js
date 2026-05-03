const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'weak-session-ids'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/Base64/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(101|Session)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{weak-session-ids_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "weak-session-ids",
    name: "Weak Session IDs",
    category: "Cryptography",
    difficulty: "Varies",
    theory: "Session IDs that are predictable (e.g., sequential numbers or base64-encoded usernames) can be guessed, enabling session hijacking without finding other exploits.",
    exploit: "Predict the session token of the admin by analyzing the sequence.",
    hint: "Send an ID that comes exactly after 'Session=100', like 'Session=101'.",
    whatToSolve: "Send a POST request to /api/vulns/weak-session-ids/execute with body: { payload: 'Session=101', level: 'low' }. The server generates session tokens sequentially (e.g., Session=100 for the last user) — by incrementing by one you predict and steal the next valid session. Include 'Session=' followed by a small number like '101' in your payload.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{weak-session-ids_success}' }",
    mitigations: ["Ensure IDs are cryptographically random and at least 128-bits.","Use well-established web frameworks for session management natively."],
    router: router
};
