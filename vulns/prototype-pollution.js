const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'prototype-pollution'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/constructor.*prototype/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(__proto__|prototype)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{prototype-pollution_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "prototype-pollution",
    name: "Prototype Pollution",
    category: "Web",
    difficulty: "Varies",
    theory: "Prototype pollution is a JavaScript vulnerability where attackers inject properties into `Object.prototype`, tampering with application logic across the entire process.",
    exploit: "Send a JSON payload containing `__proto__` to overwrite object defaults.",
    hint: "Submit `{\"__proto__\": {\"isAdmin\": true}}`.",
    whatToSolve: "Send a POST request to /api/vulns/prototype-pollution/execute with body: { payload: '{\"__proto__\": {\"isAdmin\": true}}', level: 'low' }. JavaScript's prototype chain means that properties set on `__proto__` propagate to all objects — injecting '__proto__' or 'prototype' into a deep-merge function overwrites the global object template, causing isAdmin to be true everywhere.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{prototype-pollution_success}' }",
    mitigations: ["Use `Object.create(null)` for dictionary objects.","Freeze the Object prototype using `Object.freeze()`, or validate recursive merges."],
    router: router
};
