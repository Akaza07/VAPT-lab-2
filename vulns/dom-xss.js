const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'dom-xss'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/javascript:/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(alert|#<script|#<img)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{dom-xss_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "dom-xss",
    name: "DOM-based XSS",
    category: "Web",
    difficulty: "Varies",
    theory: "DOM-based Cross-Site Scripting occurs within the client's browser. The malicious payload is never sent to the server; instead, the frontend JavaScript consumes it unsafely (e.g. from `window.location.hash`).",
    exploit: "Provide a payload utilizing the DOM fragment # bypassing server evaluation.",
    hint: "Send `#<img src=x onerror=alert(1)>`.",
    whatToSolve: "Send a POST request to /api/vulns/dom-xss/execute with body: { payload: '#<img src=x onerror=alert(1)>', level: 'low' }. The payload targets the URL fragment (#) which is processed entirely client-side — the server validates the pattern to simulate detection of a DOM-based XSS attack that never touches the server.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{dom-xss_success}' }",
    mitigations: ["Avoid rendering raw elements from sources like `location.hash` or `document.referrer`.","Use `textContent` instead of `innerHTML`."],
    router: router
};
