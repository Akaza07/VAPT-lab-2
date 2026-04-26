const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'command-execution'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/;/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(; *cat|\|.*cat|&&.*cat)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{command-execution_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "command-execution",
    name: "Command Execution",
    category: "Web",
    difficulty: "Varies",
    theory: "Command Execution happens when arbitrary operating system commands are interpreted by the host server, usually passed transparently through a vulnerable shell exec.",
    exploit: "Inject a bash concatenation character like `;` or `&&` into the payload followed by `cat /etc/passwd`.",
    hint: "Try using the semicolon delimiter to stack commands.",
    mitigations: ["Avoid direct execution of OS commands.","Use strong input sanitization and parameterized shell components."],
    router: router
};
