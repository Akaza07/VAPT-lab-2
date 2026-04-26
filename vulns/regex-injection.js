const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'regex-injection'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/REGEX_INJECT/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(a\{\d+\}|a!|catastrophic)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{regex-injection_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "regex-injection",
    name: "Regex Injection",
    category: "Web",
    difficulty: "Varies",
    theory: "Regular Expression Denial of Service (ReDoS) or Injection happens when an attacker controls a regex pattern or string evaluated by an inefficient regex, heavily spiking CPU usage.",
    exploit: "Provide a string that causes catastrophic backtracking.",
    hint: "Submit an evil string like `aaaaaaaaaaaaaaaaaaaaaaaaaaaa!` to a regex evaluating `(a+)+$`.",
    mitigations: ["Do not allow users to specify Regex execution directly.","Use non-backtracking regex engines where possible."],
    router: router
};
