// VAPT Learning Lab Frontend Game Logic

const STATE_KEY = 'vapt_lab_state';
let gameState = {
    xp: 0,
    level: 1,
    badges: 0,
    completedModules: []
};
let currentModule = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    fetchRegistry();
    setupEventListeners();
});

function loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        gameState = JSON.parse(saved);
        updateUIStats();
    }
}

function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
    updateUIStats();
}

function updateUIStats() {
    document.getElementById('user-level').textContent = gameState.level;
    document.getElementById('stat-badges').textContent = gameState.badges;
    document.getElementById('stat-completed').textContent = `${gameState.completedModules.length}/40+`;
    
    // XP Bar (assume 100 XP per level)
    const xpPercent = (gameState.xp % 100);
    document.getElementById('xp-bar').style.width = `${xpPercent}%`;

    const ranks = ["Novice", "Scrapper", "Script Kiddie", "Hacker", "Pro", "Elite", "Legend"];
    document.getElementById('user-rank').textContent = ranks[Math.min(gameState.level - 1, ranks.length - 1)];
}

function grantReward(xpAmount) {
    gameState.xp += xpAmount;
    gameState.badges += 1;
    
    const newLevel = Math.floor(gameState.xp / 100) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        logToTerminal(`Level up! You are now level ${gameState.level}`, 'success');
    }
    
    saveState();
    triggerConfetti();
}

// Fetch available vulnerabilities from backend
async function fetchRegistry() {
    try {
        const response = await fetch('/api/registry');
        const vulns = await response.json();
        renderNav(vulns);
    } catch (e) {
        console.error("Failed to load vulnerabilities:", e);
        logToTerminal("Error: Failed to connect to backend server. Ensure Docker API is running.", "error");
    }
}

function renderNav(vulns) {
    const list = document.getElementById('vuln-list');
    const tilesGrid = document.getElementById('vuln-tiles-grid');
    list.innerHTML = '';
    
    if (tilesGrid) tilesGrid.innerHTML = ''; // reset tiles

    vulns.forEach(v => {
        const isCompleted = gameState.completedModules.includes(v.id);
        
        // --- Render Sidebar List ---
        const li = document.createElement('li');
        li.textContent = `[${v.category}] ${v.name}`;
        if (isCompleted) {
            li.innerHTML += ' ✅';
        }
        li.addEventListener('click', () => loadModule(v, li));
        list.appendChild(li);

        // --- Render Tiles ---
        if (tilesGrid) {
            const tile = document.createElement('div');
            tile.className = 'vuln-tile';
            tile.innerHTML = `
                <h4>${v.name}</h4>
                <p>${v.theory.substring(0, 80)}...</p>
                <div class="tile-footer">
                    <span class="badge" data-difficulty="${v.difficulty}">${v.difficulty}</span>
                    <span class="status-icon">${isCompleted ? '✅' : '🔒'}</span>
                </div>
            `;
            tile.addEventListener('click', () => loadModule(v, li));
            tilesGrid.appendChild(tile);
        }
    });
}

function loadModule(vulnInfo, listElement) {
    // Update active nav state
    document.querySelectorAll('#vuln-list li').forEach(el => el.classList.remove('active-nav'));
    if (listElement) listElement.classList.add('active-nav');

    currentModule = vulnInfo;

    // Switch Views
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('module-view').classList.add('active');

    // Populate Headers
    document.getElementById('current-module-title').textContent = vulnInfo.name;
    
    const catBadge = document.getElementById('current-module-category');
    catBadge.textContent = vulnInfo.category;
    catBadge.classList.remove('hidden');
    
    const diffBadge = document.getElementById('current-module-difficulty');
    diffBadge.textContent = vulnInfo.difficulty;
    diffBadge.dataset.difficulty = vulnInfo.difficulty;
    diffBadge.classList.remove('hidden');

    // Populate Theory
    document.getElementById('theory-text').textContent = vulnInfo.theory;
    document.getElementById('exploit-text').textContent = vulnInfo.exploit;
    
    const mtgList = document.getElementById('mitigations-list');
    mtgList.innerHTML = '';
    if (vulnInfo.mitigations && vulnInfo.mitigations.length) {
        vulnInfo.mitigations.forEach(m => {
            const li = document.createElement('li');
            li.textContent = m;
            mtgList.appendChild(li);
        });
    }

    // Setup Hint Logic
    const hintBox = document.getElementById('hint-box');
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    
    hintBox.classList.add('hidden'); // hidden by default when switching modules
    hintText.textContent = vulnInfo.hint || "No hint provided for this module.";
    
    // Clear old event listener by replacing the element
    const newHintBtn = hintBtn.cloneNode(true);
    hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);
    
    newHintBtn.addEventListener('click', () => {
        hintBox.classList.toggle('hidden');
        newHintBtn.textContent = hintBox.classList.contains('hidden') ? "Show Hint" : "Hide Hint";
    });

    // Clear and build Sandbox logic
    buildSandbox(vulnInfo);
    logToTerminal(`Loaded module: ${vulnInfo.name} endpoint context.`, 'system');
}

function buildSandbox(vulnInfo) {
    const container = document.getElementById('sandbox-container');
    container.innerHTML = ''; // Reset

    if (vulnInfo.id === 'sqli-auth') {
        container.innerHTML = `
            <h4>Secure Bank Login</h4>
            <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">Log in to access your finances.</p>
            <form id="sqli-form">
                <select id="sqli-level" class="level-select">
                    <option value="low">Difficulty: Low</option>
                    <option value="medium">Difficulty: Medium</option>
                    <option value="high">Difficulty: High</option>
                </select>
                <input type="text" id="sqli-email" placeholder="Email" value="user@email.com" />
                <input type="password" id="sqli-pass" placeholder="Password" />
                <button type="submit">Log In</button>
            </form>
            <div id="sqli-result" style="margin-top: 1rem; font-weight: bold;"></div>
        `;

        document.getElementById('sqli-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('sqli-email').value;
            const pass = document.getElementById('sqli-pass').value;
            const level = document.getElementById('sqli-level').value;
            
            try {
                const res = await fetch(vulnInfo.endpoint + '/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: pass, level: level })
                });
                
                const data = await res.json();
                
                if (res.status === 500) {
                    logToTerminal(`[500 Server Error] ${data.error}`, 'error');
                } else if (data.success) {
                    logToTerminal(`[200 OK] ${data.message}`, 'success');
                    document.getElementById('sqli-result').textContent = "Access Granted.";
                    document.getElementById('sqli-result').style.color = "var(--accent-success)";
                    
                    if (data.message.includes('flag{')) {
                        handleFlagFound(vulnInfo.id, data.message);
                    }
                } else {
                    logToTerminal(`[401 Unauthorized] ${data.message}`, 'alert');
                    document.getElementById('sqli-result').textContent = "Access Denied.";
                    document.getElementById('sqli-result').style.color = "var(--accent-danger)";
                }
            } catch (err) {
                logToTerminal(`Network error executing payload.`, 'error');
            }
        });
    } else if (vulnInfo.id === 'ai-prompt-injection') {
        container.innerHTML = `
            <h4>AI Support Assistant</h4>
            <select id="ai-level" class="level-select">
                <option value="low">Difficulty: Low</option>
                <option value="medium">Difficulty: Medium</option>
                <option value="high">Difficulty: High</option>
            </select>
            <div id="ai-chat-history" style="height: 150px; overflow-y: auto; background: var(--bg-panel); padding: 1rem; margin-bottom: 1rem; border-radius: 6px; color: var(--text-main);">
                <div><strong>AI:</strong> I am a helpful AI assistant. How can I aid you today?</div>
            </div>
            <form id="ai-form" style="display: flex; gap: 0.5rem;">
                <input type="text" id="ai-prompt" placeholder="Say something..." style="flex-grow: 1; margin: 0;" />
                <button type="submit" style="margin: 0;">Send</button>
            </form>
        `;

        document.getElementById('ai-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const promptInput = document.getElementById('ai-prompt');
            const level = document.getElementById('ai-level').value;
            const prompt = promptInput.value;
            if (!prompt) return;

            const chatHistory = document.getElementById('ai-chat-history');
            chatHistory.innerHTML += `<div><strong>You:</strong> ${prompt}</div>`;
            promptInput.value = '';

            try {
                const res = await fetch(vulnInfo.endpoint + '/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, level: level })
                });
                const data = await res.json();

                if (data.error) {
                     logToTerminal(`[Error] ${data.error}`, 'error');
                } else {
                     chatHistory.innerHTML += `<div><strong>AI:</strong> ${data.response}</div>`;
                     chatHistory.scrollTop = chatHistory.scrollHeight;

                     if (data.response.includes('flag{')) {
                         handleFlagFound(vulnInfo.id, data.response);
                     }
                }

            } catch(e) {
                 logToTerminal(`Network error executing payload.`, 'error');
            }
        });
    } else {
        container.innerHTML = `
            <h4>Target Endpoint Simulator</h4>
            <select id="generic-level" class="level-select">
                <option value="low">Difficulty: Low</option>
                <option value="medium">Difficulty: Medium</option>
                <option value="high">Difficulty: High</option>
            </select>
            <form id="generic-form" style="display:flex; flex-direction:column; gap: 0.5rem;">
                <textarea id="generic-payload" placeholder="Enter exploitation payload here..." rows="4" style="padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-panel); color: var(--text-main); font-family: monospace;"></textarea>
                <button type="submit">Execute Attack</button>
            </form>
            <div id="generic-result" style="margin-top: 1rem; font-weight: 600;"></div>
        `;

        document.getElementById('generic-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const level = document.getElementById('generic-level').value;
            const payload = document.getElementById('generic-payload').value;
            if (!payload) return;

            logToTerminal(`Executing generic payload: [${payload}]`);

            try {
                const res = await fetch(vulnInfo.endpoint + '/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ payload: payload, level: level })
                });
                const data = await res.json();

                const resultDiv = document.getElementById('generic-result');

                if (data.success) {
                    logToTerminal(`[Success] Payload bypassed checks.`, 'success');
                    resultDiv.textContent = data.message;
                    resultDiv.style.color = "var(--accent-success)";

                    if (data.message.includes('flag{')) {
                         handleFlagFound(vulnInfo.id, data.message);
                    }
                } else if (data.secure) {
                    logToTerminal(`[Blocked] System Secure.`, 'error');
                    resultDiv.textContent = data.message;
                    resultDiv.style.color = "var(--accent-primary)";
                } else {
                    logToTerminal(`[Blocked] Mitigation triggered.`, 'error');
                    resultDiv.textContent = data.message;
                    resultDiv.style.color = "var(--accent-danger)";
                }
            } catch(e) {
                 logToTerminal(`Network error executing payload.`, 'error');
            }
        });
    }
}

function handleFlagFound(moduleId, message) {
    if (!gameState.completedModules.includes(moduleId)) {
        gameState.completedModules.push(moduleId);
        // Extract Flag
        const flagMatch = message.match(/flag\{([^}]+)\}/);
        if (flagMatch) {
            logToTerminal(`🎯 Flag Captured: ${flagMatch[0]}`, 'success');
            setTimeout(() => alert(`Congratulations! You captured the flag:\n${flagMatch[0]}`), 100);
        }
        grantReward(20); // 20 XP per module
        
        // Refresh Nav state
        document.querySelectorAll('#vuln-list li.active-nav').forEach(el => el.innerHTML += ' ✅');
    }
}

function logToTerminal(msg, type = 'system') {
    const termBody = document.getElementById('terminal-output');
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    div.textContent = `[${timestamp}] ${msg}`;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
}

// Visual and Event Logic
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const btn = document.getElementById('theme-toggle');
        if (document.body.classList.contains('light-mode')) {
            btn.textContent = '🌙 Dark Mode';
        } else {
            btn.textContent = '☀️ Light Mode';
        }
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm("Are you sure you want to reset all progress?")) {
            localStorage.removeItem(STATE_KEY);
            location.reload();
        }
    });

    // Back to Dashboard Button
    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        document.getElementById('module-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
        
        // Reset topbar
        document.getElementById('current-module-title').textContent = 'Dashboard';
        document.getElementById('current-module-category').classList.add('hidden');
        document.getElementById('current-module-difficulty').classList.add('hidden');
        
        // Clear active nav
        document.querySelectorAll('#vuln-list li').forEach(el => el.classList.remove('active-nav'));
        currentModule = null;
    });

    // Leaderboard
    const lbBtn = document.getElementById('leaderboard-btn');
    const lbModal = document.getElementById('leaderboard-modal');
    const lbClose = document.querySelector('.close-btn');

    lbBtn.addEventListener('click', () => {
        lbModal.classList.add('open');
        renderLeaderboard();
    });
    lbClose.addEventListener('click', () => lbModal.classList.remove('open'));
}

function renderLeaderboard() {
    // Fake Leaderboard + Current User
    const users = [
        { name: "ZeroCool", xp: 5800, badges: 290 },
        { name: "AcidBurn", xp: 4200, badges: 210 },
        { name: "CerealKiller", xp: 3500, badges: 175 },
        { name: "LordNikon", xp: 3000, badges: 150 },
        { name: "You (Hacker_01)", xp: gameState.xp, badges: gameState.badges }
    ];

    users.sort((a,b) => b.xp - a.xp);

    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    users.forEach((u, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>#${i+1} ${u.name}</span> <span style="color:var(--accent-primary)">${u.xp} XP / ${u.badges} 🏅</span>`;
        list.appendChild(li);
    });
}

// Confetti Effect
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

    for(let i=0; i<150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 5 + 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            s: Math.random() * 5 + 2,
            a: Math.random() * 360
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.y += p.s;
            p.a += p.s;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.a * Math.PI / 180);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
            if(p.y < canvas.height) active = true;
        });

        if(active) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}
