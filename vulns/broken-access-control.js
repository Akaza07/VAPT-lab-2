const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'broken-access-control'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/^\/api\/profile\?id=1$/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(id=1|id=001)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{broken-access-control_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "broken-access-control",
    name: "Broken Access Control",
    category: "Web",
    difficulty: "Varies",
    theory: "Broken Access Control allows attackers to bypass authorization, viewing or modifying data they shouldn't access—such as accessing another user's profile ID directly in a URL.",
    exploit: "Modify the account ID in the payload to access another user's restricted information.",
    hint: "Try sending an ID parameter as 0 or 1 representing an admin, instead of your standard ID.",
    mitigations: ["Implement role-based access control (RBAC).","Verify ownership mathematically on the backend."],
    router: router
};
