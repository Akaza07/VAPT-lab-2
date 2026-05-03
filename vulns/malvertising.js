const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'malvertising'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/eval/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(location=|evil|redirect)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{malvertising_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "malvertising",
    name: "Malvertising",
    category: "Web",
    difficulty: "Varies",
    theory: "Malvertising relies on injecting malicious code into legitimate online advertising networks, redirecting users to exploit kits or dropping malware.",
    exploit: "Supply a deceptive banner ad payload containing a silent iframe or JS redirect.",
    hint: "Send a payload like `<script>window.location='malware.com'</script>` encoded in an ad snippet.",
    whatToSolve: "Send a POST request to /api/vulns/malvertising/execute with body: { payload: '<script>window.location=\'evil.com\'</script> redirect to evil', level: 'low' }. The ad network embeds your payload in a page without validation — injecting JavaScript that sets 'location=', performs a 'redirect', or references 'evil' silently redirects victims visiting the page.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{malvertising_success}' }",
    mitigations: ["Use iframe sandboxing (`sandbox=\"allow-scripts\"`) for 3rd party ads.","Enforce strict Content Security Policies on trusted endpoints only."],
    router: router
};
