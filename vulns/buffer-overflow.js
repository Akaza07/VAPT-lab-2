const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'buffer-overflow'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/^A{256,}$/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/A{200,}/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{buffer-overflow_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "buffer-overflow",
    name: "Buffer Overflows",
    category: "System",
    difficulty: "Varies",
    theory: "A buffer overflow anomaly happens when a program writes more data to a block of memory (buffer) than it was allocated to hold, allowing contiguous memory overwrites.",
    exploit: "Send an excessively long string to overwrite the instruction pointer.",
    hint: "Send more than 256 'A' characters to execute the application crash.",
    whatToSolve: "Send a POST request to /api/vulns/buffer-overflow/execute with body: { payload: 'AAAAAAAAAA...' (200 or more 'A' characters), level: 'low' }. The server simulates a fixed-size buffer — writing more data than it can hold causes an overflow. You can quickly generate this with: 'A'.repeat(200).",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{buffer-overflow_success}' }",
    mitigations: ["Use bounds checking and modern memory-safe languages.","Enable ASLR and DEP flags."],
    router: router
};
