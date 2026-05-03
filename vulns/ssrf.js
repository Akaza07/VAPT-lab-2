const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'ssrf'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/0\.0\.0\.0/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(127\.0\.0\.1|169\.254|localhost)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{ssrf_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "ssrf",
    name: "Server-Side Request Forgery (SSRF)",
    category: "Web",
    difficulty: "Varies",
    theory: "SSRF occurs when an attacker forces the server to make a request to an internal or external resource on the attacker's behalf, bypassing firewalls.",
    exploit: "Supply a local IP address to an image fetcher or webhook service.",
    hint: "Send `http://169.254.169.254/latest/meta-data/` or `http://127.0.0.1`.",
    whatToSolve: "Send a POST request to /api/vulns/ssrf/execute with body: { payload: 'http://127.0.0.1', level: 'low' }. The server makes an outbound HTTP request using your supplied URL without validation — pointing it to an internal IP (127.0.0.1 or 169.254.169.254) forces it to leak internal metadata.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{ssrf_success}' }",
    mitigations: ["Whitelist allowed domains strictly.","Block resolution of internal IPs (10.x, 127.x, 169.254.x)."],
    router: router
};
