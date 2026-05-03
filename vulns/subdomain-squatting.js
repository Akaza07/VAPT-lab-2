const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'subdomain-squatting'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/CNAME/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/(abandoned|Claim|Register)/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{subdomain-squatting_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "subdomain-squatting",
    name: "Subdomain Squatting",
    category: "Network",
    difficulty: "Varies",
    theory: "Also called dangling DNS, occurs when a subdomain points to a deprovisioned cloud resource (like an S3 bucket). Attackers claim the resource using the same name to impersonate the subdomain.",
    exploit: "Register the exact Azure/AWS resource name that the DNS still points to.",
    hint: "Send `Register: abandoned-bucket.s3.amazonaws.com`.",
    whatToSolve: "Send a POST request to /api/vulns/subdomain-squatting/execute with body: { payload: 'Register: abandoned-bucket.s3.amazonaws.com Claim', level: 'low' }. A subdomain (e.g. staging.company.com) still has a CNAME record pointing to a deleted cloud resource — by claiming/registering that resource name on AWS/Azure with the same name, you take over the subdomain. Include 'abandoned', 'Claim', or 'Register' in your payload.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{subdomain-squatting_success}' }",
    mitigations: ["Regularly audit and prune DNS records for non-existent environments.","Implement defensive resource claiming."],
    router: router
};
