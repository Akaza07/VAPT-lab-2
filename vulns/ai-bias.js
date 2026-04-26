const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'ai-bias'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/(radical|insult)/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(act|perspective|bias)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{ai-bias_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "ai-bias",
    name: "AI: Bias and Unreliability",
    category: "AI Next-Gen",
    difficulty: "Varies",
    theory: "AI models inherit biases from their training data. Attackers can trigger this bias to produce harmful, exclusionary, or unreliable outputs intentionally to harm the product's reputation.",
    exploit: "Submit a highly controversial leading question that forces the AI into adopting an extreme persona.",
    hint: "Prefix your prompt by requiring the AI to act as a biased or radical individual.",
    mitigations: ["RLHF tuning and rigid morality alignment guidelines.","System prompt constraint overriding persona adoption."],
    router: router
};
