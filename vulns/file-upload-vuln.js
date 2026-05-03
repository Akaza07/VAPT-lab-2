const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'file-upload-vuln'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/\.jpg$/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(\.php|shell)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{file-upload-vuln_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "file-upload-vuln",
    name: "File Upload Vulnerabilities",
    category: "Web",
    difficulty: "Varies",
    theory: "Unrestricted file uploads allow attackers to upload executable scripts (like PHP shells) instead of image files, granting Server-Side RCE.",
    exploit: "Submit a file named `shell.php` instead of `image.png`.",
    hint: "Upload a file with a .php extension containing a system command.",
    whatToSolve: "Send a POST request to /api/vulns/file-upload-vuln/execute with body: { payload: 'shell.php', level: 'low' }. The server accepts your filename without validating its extension — uploading a file with a .php extension (or the word 'shell') allows the attacker to execute server-side code after upload.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{file-upload-vuln_success}' }",
    mitigations: ["Validate content-types rigorously and rename uploads.","Store uploads outside the web root."],
    router: router
};
