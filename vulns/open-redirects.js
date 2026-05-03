const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'open-redirects'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/^\/\/evil\.com/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(http:\/\/|\/\/|evil\.com)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{open-redirects_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "open-redirects",
    name: "Open Redirects",
    category: "Web",
    difficulty: "Varies",
    theory: "Open Redirects occur when an application processes a user-supplied URL and redirects to it without validation, enabling highly effective phishing attacks.",
    exploit: "Provide an external URL in a 'next' or 'redirectTo' parameter.",
    hint: "Send `?next=http://evil.com`.",
    whatToSolve: "Send a POST request to /api/vulns/open-redirects/execute with body: { payload: '?next=http://evil.com', level: 'low' }. The server reads the 'next' redirect parameter and forwards the user to it without validation — supplying an external URL like 'http://evil.com' or '//evil.com' causes the application to redirect victims off-site, enabling phishing.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{open-redirects_success}' }",
    mitigations: ["Maintain a whitelist of safe, internal redirect paths.","Never blindly concatenate user input into the 'Location' header."],
    router: router
};
