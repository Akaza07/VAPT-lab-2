const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'xml-bombs'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/DTD/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(\&lol9;)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{xml-bombs_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "xml-bombs",
    name: "XML Bombs (Billion Laughs)",
    category: "Web",
    difficulty: "Varies",
    theory: "An XML Bomb, often called the Billion Laughs attack, is a tiny XML file containing highly nested entity expansions that overwhelm server memory during parsing, resulting in DoS.",
    exploit: "Submit a highly nested entity expansion XML payload.",
    hint: "Submit the standard 'lolz' XML bomb reference `&lol9;`.",
    whatToSolve: "Send a POST request to /api/vulns/xml-bombs/execute with body: { payload: '<?xml version=\"1.0\"?><!DOCTYPE lolz [<!ENTITY lol \"lol\"><!ENTITY lol9 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">]><lolz>&lol9;</lolz>', level: 'low' }. The Billion Laughs attack uses recursive XML entity expansion — a tiny 1KB file expands to gigabytes in memory, crashing the parser. Include '&lol9;' in your payload to trigger it.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{xml-bombs_success}' }",
    mitigations: ["Configure XML parsers to refuse entity expansion entirely.","Set maximum memory allocation limits on parser buffers."],
    router: router
};
