const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Registry to hold dynamically loaded vulnerabilities
const vulnRegistry = [];

// Dynamically load vulnerabilities
const vulnsPath = path.join(__dirname, 'vulns');
if (!fs.existsSync(vulnsPath)) {
    fs.mkdirSync(vulnsPath);
}

fs.readdirSync(vulnsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const vulnModule = require(path.join(vulnsPath, file));
        
        // Modules should export: id, name, category (web/ai), difficulty, theory, exploit, mitigations, router
        if (vulnModule.id && vulnModule.router) {
            app.use(`/api/vulns/${vulnModule.id}`, vulnModule.router);
            vulnRegistry.push({
                id: vulnModule.id,
                name: vulnModule.name,
                category: vulnModule.category || 'Web',
                difficulty: vulnModule.difficulty || 'Novice',
                theory: vulnModule.theory,
                exploit: vulnModule.exploit,
                hint: vulnModule.hint,
                mitigations: vulnModule.mitigations,
                endpoint: `/api/vulns/${vulnModule.id}`
            });
            console.log(`Loaded vulnerability module: ${vulnModule.name}`);
        }
    }
});

// API endpoint to fetch all available vulnerabilities for the dashboard
app.get('/api/registry', (req, res) => {
    res.json(vulnRegistry);
});

// Reset endpoint (clears active sessions/in-memory states, handled via server restart or memory flush per module ideally)
app.post('/api/reset', (req, res) => {
    // In a real scenario, we might trigger a DB reset script here.
    res.json({ message: "Vulnerability states reset." });
});

app.listen(PORT, () => {
    console.log(`[+] VAPT Lab Web Server running on port ${PORT}`);
});
