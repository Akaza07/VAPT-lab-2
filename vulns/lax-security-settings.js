const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'lax-security-settings'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/tomcat/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(admin:admin|admin:password|default)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{lax-security-settings_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "lax-security-settings",
    name: "Lax Security Settings",
    category: "Configuration",
    difficulty: "Varies",
    theory: "Security Misconfiguration or Lax Settings is the most commonly seen issue, where default accounts, outdated software, or unprotected files are deployed to production.",
    exploit: "Attempt to access the default administration console with default credentials.",
    hint: "Send `admin:admin` or `admin:password` to the endpoint.",
    mitigations: ["Automate configuration hardening and remove unused features.","Change all default credentials immediately."],
    router: router
};
