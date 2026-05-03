const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'email-spoofing'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/Reply-To:/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/From:.*admin/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{email-spoofing_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "email-spoofing",
    name: "Email Spoofing",
    category: "Social Engineering",
    difficulty: "Varies",
    theory: "Email spoofing involves forging the sender address so that the message appears to originate from a legitimate source, bypassing basic trust checks.",
    exploit: "Modify the SMTP header `From:` to match the target's internal domain exactly.",
    hint: "Inject `From: admin@yourcompany.com`.",
    whatToSolve: "Send a POST request to /api/vulns/email-spoofing/execute with body: { payload: 'From: admin@company.com\\nSubject: Urgent Security Alert', level: 'low' }. Forging the SMTP 'From:' header to use an admin/trusted address tricks recipients into trusting the email — the server detects the 'From:.*admin' pattern to confirm the spoof.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{email-spoofing_success}' }",
    mitigations: ["Implement strict DMARC, DKIM, and SPF validation.","Flag external emails visually."],
    router: router
};
