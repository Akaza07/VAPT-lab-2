const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'logging-monitoring'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/%0D%0A/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(\\n|%0D%0A)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{logging-monitoring_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "logging-monitoring",
    name: "Logging and Monitoring",
    category: "Configuration",
    difficulty: "Varies",
    theory: "Insufficient logging allows attackers to achieve their goals repeatedly without detection. If logs are generated but never monitored, breaches can last months.",
    exploit: "Evade detection by injecting log-forging characters (like CRLF) so your attack doesn't trip alarms.",
    hint: "Inject a newline character `\\n` to push your payload off the primary log line.",
    mitigations: ["Log all authentication and high-value transactions.","Use a SIEM system to establish alerting for anomalies."],
    router: router
};
