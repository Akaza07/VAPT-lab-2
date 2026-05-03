const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'reflected-xss'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/<svg/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(search=.*<script|alert)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{reflected-xss_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "reflected-xss",
    name: "Reflected XSS",
    category: "Web",
    difficulty: "Varies",
    theory: "Reflected Cross-Site Scripting immediately echoes unsanitized user input back into the page. The attacker must trick a victim into clicking a crafted URL containing the payload.",
    exploit: "Send a payload via a GET query parameter that reflects directly into the HTML response.",
    hint: "Send `?search=<script>alert(1)</script>`.",
    whatToSolve: "Send a POST request to /api/vulns/reflected-xss/execute with body: { payload: 'search=<script>alert(1)</script>', level: 'low' }. The server echoes the raw input without sanitizing it, matching the XSS pattern and triggering the exploit.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{reflected-xss_success}' }",
    mitigations: ["Implement context-aware output encoding (HTML Entity Encoding).","Deploy a strict Content-Security-Policy."],
    router: router
};
