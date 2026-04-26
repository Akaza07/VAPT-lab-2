const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'information-leakage'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/application\/xml/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/({invalid|error|stack)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{information-leakage_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "information-leakage",
    name: "Information Leakage",
    category: "Web",
    difficulty: "Varies",
    theory: "The application unintentionally reveals sensitive data, such as stack traces, framework versions, or configuration details, aiding attackers in further exploitation.",
    exploit: "Trigger a severe syntax error to force the application to drop an unhandled stack trace.",
    hint: "Send an invalid JSON structure like `{invalid_json: ` to break the parser.",
    mitigations: ["Use generic error handlers and suppress unhandled exceptions.","Strip server banners (e.g. Server: nginx/1.14.0)."],
    router: router
};
