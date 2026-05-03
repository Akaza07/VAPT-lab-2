const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'user-enumeration'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/Timing/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(Guess: |admin)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{user-enumeration_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "user-enumeration",
    name: "User Enumeration",
    category: "Web",
    difficulty: "Varies",
    theory: "Differences in application responses (e.g., 'User not found' vs 'Invalid password') or response times allow an attacker to guess valid usernames.",
    exploit: "Observe backend responses to identify a valid user id.",
    hint: "Send 'Guess: admin' expecting a 'Password invalid' specific response.",
    whatToSolve: "Send a POST request to /api/vulns/user-enumeration/execute with body: { payload: 'Guess: admin', level: 'low' }. The login endpoint returns different error messages for 'user not found' vs 'wrong password' — this difference reveals which usernames are valid. Sending 'Guess: admin' confirms that the username 'admin' exists, which can then be used for a targeted brute-force attack.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{user-enumeration_success}' }",
    mitigations: ["Use generic error messaging like 'Login failed'.","Implement strict rate-limiting on authentication endpoints."],
    router: router
};
