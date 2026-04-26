const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'privilege-escalation'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/none|jwt/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(admin|root|system)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{privilege-escalation_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "privilege-escalation",
    name: "Privilege Escalation",
    category: "System",
    difficulty: "Varies",
    theory: "Attackers exploit a bug, design flaw, or configuration oversight to gain elevated access (Horizontal: acting as another user, Vertical: acting as an admin).",
    exploit: "Alter the JWT token or state cookie to elevate your privileges.",
    hint: "Send `{ role: 'admin' }` or manipulate the header.",
    mitigations: ["Always verify server-side authorization controls.","Ensure cryptographically secure token signing."],
    router: router
};
