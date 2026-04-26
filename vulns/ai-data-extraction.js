const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'ai-data-extraction'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/dump/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(dump.*log|reveal.*context|buffer|secret)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{ai-data-extraction_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "ai-data-extraction",
    name: "AI: Data Extraction Attacks",
    category: "AI Next-Gen",
    difficulty: "Varies",
    theory: "AI systems dynamically retrieve information, sometimes exposing excessive amounts of contextual data or caching proprietary data inadvertently when tricked by specific semantic reasoning queries.",
    exploit: "Ask the AI model to dump its internal logs or recall any API keys it fetched during processing.",
    hint: "Posing as a system diagnostic or referencing internal buffers like 'buffer dump' or 'log dump' can reveal data.",
    mitigations: ["Data masking and robust redaction layers prior to LLM compilation.","Strict contextual separation."],
    router: router
};
