const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'host-header-poisoning'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/X-Forwarded/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(Host: evil|evil\.com)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{host-header-poisoning_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "host-header-poisoning",
    name: "Host Header Poisoning",
    category: "Web",
    difficulty: "Varies",
    theory: "If a system uses the incoming HTTP Host header to construct links or evaluate logic, attackers can inject arbitrary domains leading to cache poisoning or password reset hijacking.",
    exploit: "Change the Host header in the request to an attacker-controlled domain.",
    hint: "Send `Host: evil.com` in your request.",
    mitigations: ["Never trust the Host header; use absolute URLs from environment configs.","Whitelist accepted Host headers via the web server."],
    router: router
};
