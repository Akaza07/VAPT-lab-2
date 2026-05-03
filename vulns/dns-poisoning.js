const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'dns-poisoning'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/192\.168/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(IN A|spoof|DNS)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{dns-poisoning_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "dns-poisoning",
    name: "DNS Poisoning",
    category: "Network",
    difficulty: "Varies",
    theory: "DNS cache poisoning introduces fraudulent IP addresses into the DNS resolvers cache, routing traffic towards a server controlled by attackers instead of the main host.",
    exploit: "Simulate a fake DNS UDP resolution record payload overriding the mapping.",
    hint: "Submit a mapping payload pointing domain.com to an attacker IP.",
    whatToSolve: "Send a POST request to /api/vulns/dns-poisoning/execute with body: { payload: 'domain.com IN A spoof DNS 1.3.3.7', level: 'low' }. The payload simulates injecting a fraudulent DNS record — including 'IN A', 'spoof', or 'DNS' in your payload mimics a poisoned DNS response that redirects legitimate traffic to an attacker-controlled IP.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{dns-poisoning_success}' }",
    mitigations: ["Use DNSSEC.","Ensure random packet transaction IDs."],
    router: router
};
