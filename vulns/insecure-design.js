const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'insecure-design'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/parallel/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(COUPON|multiple|array)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{insecure-design_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "insecure-design",
    name: "Insecure Design",
    category: "Architecture",
    difficulty: "Varies",
    theory: "Insecure design encompasses missing or ineffective control designs. It differs from implementation bugs; an insecure design is perfectly coded but strategically vulnerable (e.g., no rate limit on a free trial API).",
    exploit: "Abuse an inherently flawed business logic flow, such as applying a coupon code infinitely.",
    hint: "Submit 'COUPON100' multiple times in a single array payload.",
    mitigations: ["Implement threat modeling during technical design.","Use secure design patterns and enforce business constraints at the database level."],
    router: router
};
