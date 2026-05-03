const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'cross-site-script-inclusion'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/Prototype/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(<script.*src=.*userINFO)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{cross-site-script-inclusion_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "cross-site-script-inclusion",
    name: "Cross-Site Script Inclusion (XSSI)",
    category: "Web",
    difficulty: "Varies",
    theory: "XSSI leaks sensitive data when an attacker uses the `<script>` tag to dynamically load a confidential API endpoint from a cross-origin site, bypassing Same-Origin Policy since scripts inherently bypass SOP.",
    exploit: "Request an authenticated JSON endpoint via a script element.",
    hint: "Send `<script src='https://bank.com/api/userINFO'></script>`.",
    whatToSolve: "Send a POST request to /api/vulns/cross-site-script-inclusion/execute with body: { payload: \"<script src='https://bank.com/api/userINFO'></script>\", level: 'low' }. By loading a JSON endpoint via a <script> tag from a cross-origin attacker page, the browser executes the JSON response as JavaScript — the server detects the '<script src=...userINFO' pattern to confirm the attack.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{cross-site-script-inclusion_success}' }",
    mitigations: ["Use unguessable CSRF-style tokens for APIs.","Prefix JSON files with parser-breaking junk like `)]}',\\n`."],
    router: router
};
