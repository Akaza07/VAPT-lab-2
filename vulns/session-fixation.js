const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'session-fixation'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/cookie/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(session_id=|PHPSESSID=)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{session-fixation_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "session-fixation",
    name: "Session Fixation",
    category: "Web",
    difficulty: "Varies",
    theory: "Session Fixation allows an attacker to hijack a user session by providing them with a known identifier before they authenticate, causing the server to log the victim in using the attacker's id.",
    exploit: "Provide a static session ID URL to force authentication via GET parameters.",
    hint: "Send `?PHPSESSID=1234` simulating the forced entry.",
    mitigations: ["Always generate a completely new Session ID upon successful login.","Do not accept session IDs in the URL."],
    router: router
};
