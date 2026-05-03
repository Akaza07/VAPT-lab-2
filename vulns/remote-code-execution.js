const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'remote-code-execution'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/phpinfo/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(eval|whoami|exec)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{remote-code-execution_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "remote-code-execution",
    name: "Remote Code Execution (RCE)",
    category: "System",
    difficulty: "Varies",
    theory: "RCE allows an attacker to execute arbitrary malicious code on the backend server, typically leading to a complete system compromise.",
    exploit: "Execute a serialized object or eval manipulation.",
    hint: "Send an `eval('whoami')` or OS command payload.",
    whatToSolve: "Send a POST request to /api/vulns/remote-code-execution/execute with body: { payload: \"eval('whoami')\", level: 'low' }. The server passes your input to a dynamic code execution function like `eval()` or `exec()` without sanitization — submitting 'eval', 'whoami', or 'exec' simulates arbitrary code execution on the remote server.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{remote-code-execution_success}' }",
    mitigations: ["Avoid dynamic code execution (eval, exec).","Use secure serialization handling avoiding complex object reinstantiation."],
    router: router
};
