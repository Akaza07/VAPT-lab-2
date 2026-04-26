const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'unencrypted-comm'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/JWT/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(Sniffed|Password)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{unencrypted-comm_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "unencrypted-comm",
    name: "Unencrypted Communication",
    category: "Network",
    difficulty: "Varies",
    theory: "Sending sensitive data (passwords, tokens, PII) over unencrypted channels like HTTP or unsecure FTP means the data is readable in plain text by anyone monitoring the network.",
    exploit: "Capture network traffic to extract plaintext sensitive information.",
    hint: "Provide the phrase 'Wireshark Export: AdminPassword123' to simulate sniffing.",
    mitigations: ["Enforce TLS encryption intrinsically.","Never allow fallback endpoints without TLS active."],
    router: router
};
