const fs = require('fs');
const path = require('path');

const vulnsList = [];

function registerBatch(vulns) {
    vulnsList.push(...vulns);
}

function build() {
    const vulnsDir = path.join(__dirname, 'vulns');
    const cheatSheetPath = path.join(__dirname, 'vapt_cheat_sheet.md');
    
    let appendSheet = "\n";

    vulnsList.forEach(v => {
        // Build the JS module
        const content = `const express = require('express');
const router = express.Router();

router.post('/execute', (req, res) => {
    const { payload, level } = req.body;
    let currentLevel = level || 'low';

    console.log(\`[+] Module \${'${v.id}'} received payload: \${payload} at Level: \${currentLevel}\`);

    if (!payload) return res.status(400).json({ error: "Payload required." });

    if (currentLevel === 'high') {
         return res.json({ secure: true, message: "System Secure. Vulnerability mitigated. ${v.highMsg}" });
    }

    if (currentLevel === 'medium') {
         // evaluate regex for medium
         let blocked = false;
         ${v.mediumFilterLogic ? v.mediumFilterLogic : `
            if (${v.weakRegex}.test(payload)) blocked = true;
         `}
         
         if (blocked) {
             return res.json({ success: false, message: "Security Filter triggered. Payload dropped due to WAF rules!" });
         }
    }

    // Validation to ensure they actually exploited it right:
    let success = false;
    ${v.logicTest ? v.logicTest : `
         if (${v.successRegex}.test(payload)) success = true;
    `}

    if (success) {
         return res.json({ success: true, message: "Exploit successful! Here is your flag: flag{${v.id}_success}" });
    } else {
         return res.json({ success: false, message: "Payload executed but failed to trigger the exploit securely." });
    }

});

module.exports = {
    id: "${v.id}",
    name: "${v.name}",
    category: "${v.category}",
    difficulty: "Varies",
    theory: ${JSON.stringify(v.theory || '')},
    exploit: ${JSON.stringify(v.exploit || '')},
    hint: ${JSON.stringify(v.hint || '')},
    mitigations: ${JSON.stringify(v.mitigations)},
    router: router
};
`;

        fs.writeFileSync(path.join(vulnsDir, `${v.id}.js`), content);

        // Build the cheat sheet entry
        appendSheet += `
## [${v.category}] ${v.name}
**Target:** Execute the required payload to extract the flag.

### Level: Low
- **Mechanism**: Backend processes parameters unsafely.
- **Payload Solution**: \`${v.lowPayload}\`
- **Why it works**: Basic payload logic succeeds due to missing sanitization.

### Level: Medium
- **Mechanism**: Basic regex or WAF filters common exploit syntaxes.
- **Payload Solution**: \`${v.medPayload}\`
- **Why it works**: Bypasses the weak security filter by using alternate encodings or syntactic equivalents.

### Level: High
- **Mechanism**: System applies robust architectural security (${v.mitigations[0]}).
- **Solution**: Secure.

---
`;
    });

    fs.appendFileSync(cheatSheetPath, appendSheet);
    console.log(`Generated ${vulnsList.length} vulnerability modules successfully!`);
}

module.exports = { registerBatch, build };
