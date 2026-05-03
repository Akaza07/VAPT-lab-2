const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'xxe'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/php:\/\/filter/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(SYSTEM|file:\/\/\/etc)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{xxe_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "xxe",
    name: "XML External Entities (XXE)",
    category: "Web",
    difficulty: "Varies",
    theory: "XXE occurs when weakly configured XML parsers process 'external entities' referenced within a Document Type Definition (DTD). Attackers can exfiltrate local files like /etc/passwd.",
    exploit: "Form an XML DOCTYPE declaring a SYSTEM entity pointing to /etc/passwd.",
    hint: "Provide an entity `<!ENTITY xxe SYSTEM \"file:///etc/passwd\">`.",
    whatToSolve: "Send a POST request to /api/vulns/xxe/execute with body: { payload: '<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><foo>&xxe;</foo>', level: 'low' }. The XML parser processes the SYSTEM entity and reads the local file — the SYSTEM keyword in the payload confirms the exploit.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{xxe_success}' }",
    mitigations: ["Disable External Entity Resolution (DTD) completely in the XML parser.","Use JSON or simpler data formats instead."],
    router: router
};
