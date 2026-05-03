const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'cross-site-request-forgery'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/<img/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(transfer|POST|GET)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{cross-site-request-forgery_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "cross-site-request-forgery",
    name: "Cross-Site Request Forgery",
    category: "Web",
    difficulty: "Varies",
    theory: "CSRF tricks a victim's browser into executing an unwanted action on a trusted site by inheriting their active cookies and authentication state via forged backend requests.",
    exploit: "Provide an img src payload or form that forces a GET/POST state altering URL request.",
    hint: "Craft an HTML script that sends a hidden GET request to /transfer.",
    whatToSolve: "Send a POST request to /api/vulns/cross-site-request-forgery/execute with body: { payload: '<form method=POST action=/transfer><input name=amount value=1000></form>', level: 'low' }. The payload simulates a forged cross-site form POST request to a state-changing endpoint — the server detects keywords like 'transfer', 'POST', or 'GET' to confirm the attack.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{cross-site-request-forgery_success}' }",
    mitigations: ["Implement Synchronizer Token Patterns (Anti-CSRF tokens).","Set cookie SameSite attributes to Strict/Lax."],
    router: router
};
