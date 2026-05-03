const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'mass-assignment'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/role/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(is_admin|admin|true)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{mass-assignment_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "mass-assignment",
    name: "Mass Assignment",
    category: "Web",
    difficulty: "Varies",
    theory: "Mass Assignment (or Overposting) occurs when backend frameworks automatically bind client inputs to database objects without filtering out restricted variables (like `is_admin=true`).",
    exploit: "Add an extra parameter `is_admin: true` to a standard user profile update JSON.",
    hint: "Send `{ \"username\": \"hacker\", \"is_admin\": true }`.",
    whatToSolve: "Send a POST request to /api/vulns/mass-assignment/execute with body: { payload: '{ \"username\": \"hacker\", \"is_admin\": true }', level: 'low' }. The framework blindly binds all incoming JSON keys to the database model — adding the hidden field 'is_admin: true' to a regular profile update silently escalates your own privileges to admin.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{mass-assignment_success}' }",
    mitigations: ["Explicitly declare variable bindings (allow-listing).","Use Data Transfer Objects (DTOs) instead of raw DB entities."],
    router: router
};
