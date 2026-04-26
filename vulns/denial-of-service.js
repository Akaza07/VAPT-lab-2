const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'denial-of-service'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/{.*{.*{/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/({.*{.*{|dos|flood)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{denial-of-service_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "denial-of-service",
    name: "Denial of Service Attacks",
    category: "System",
    difficulty: "Varies",
    theory: "DoS prevents legitimate users from accessing services by flooding resources, CPU overhead, or causing software panics in applications leading to unresponsive states.",
    exploit: "Initiate thousands of requests via an infinite loop or excessive recursive JSON.",
    hint: "Send an extremely nested JSON payload to lock up parsing logic.",
    mitigations: ["Apply Rate Limiting and WAFs.","Restrict request body payload chunk dimensions."],
    router: router
};
