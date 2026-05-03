const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'downgrade-attack'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/^SSLv3$/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(SSL|TLSv1\.0|downgrade)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{downgrade-attack_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "downgrade-attack",
    name: "Downgrade Attacks",
    category: "Network",
    difficulty: "Varies",
    theory: "Attackers force a system to abandon a high-security mode and operate in a fallback, less secure mode, such as downgrading from TLS 1.3 to TLS 1.0 or plaintext.",
    exploit: "Send a connection request explicitly identifying that high-level cryptography is not supported by your client.",
    hint: "Send the payload 'TLSv1.0-Only' or 'SSLv3' to bypass modern checks.",
    whatToSolve: "Send a POST request to /api/vulns/downgrade-attack/execute with body: { payload: 'Client-Hello: TLSv1.0 downgrade only', level: 'low' }. The payload simulates a TLS ClientHello advertising only weak/legacy protocol support — including 'SSL', 'TLSv1.0', or 'downgrade' forces the handshake to fall back to an insecure cipher suite.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{downgrade-attack_success}' }",
    mitigations: ["Disable obsolete protocols entirely on the host.","Enforce HSTS (HTTP Strict Transport Security)."],
    router: router
};
