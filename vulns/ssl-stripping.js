const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'ssl-stripping'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/spoof/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(http:\/\/|strip|Rewrite)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{ssl-stripping_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "ssl-stripping",
    name: "SSL Stripping",
    category: "Network",
    difficulty: "Varies",
    theory: "A Man-in-the-Middle (MITM) attack that intercepts HTTP requests before they're redirected to HTTPS and transparently serves standard HTTP, capturing all unencrypted subsequent data.",
    exploit: "Intercept the initial request and rewrite the `https://` response headers back to `http://`.",
    hint: "Submit 'Rewrite Location: http://'",
    whatToSolve: "Send a POST request to /api/vulns/ssl-stripping/execute with body: { payload: 'Rewrite Location: http://victim.com strip SSL', level: 'low' }. As a man-in-the-middle, you intercept the server's HTTPS redirect response and rewrite the Location header from 'https://' to 'http://' — include 'strip', 'Rewrite', or 'http://' in your payload to simulate this downgrade.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{ssl-stripping_success}' }",
    mitigations: ["Implement HSTS (HTTP Strict Transport Security).","Disallow initial HTTP access; hardcode HTTPS redirection."],
    router: router
};
