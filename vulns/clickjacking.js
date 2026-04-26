const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'clickjacking'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/opacity='0'/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/<iframe.*src/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{clickjacking_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "clickjacking",
    name: "Clickjacking",
    category: "Web",
    difficulty: "Varies",
    theory: "Clickjacking occurs when an attacker uses transparent, unclickable iframes to overlay a legitimate website inside a malicious page, tricking users into clicking restricted elements.",
    exploit: "Inject an iframe snippet to encapsulate the target, altering z-index overlays.",
    hint: "Provide an iframe <iframe> tag with opacity to 0 pointing to the target.",
    mitigations: ["Set X-Frame-Options to DENY or SAMEORIGIN.","Implement Content-Security-Policy (CSP) frame-ancestors."],
    router: router
};
