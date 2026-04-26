# VAPT Learning Lab

A modernized, gamified, and self-contained vulnerability assessment and penetration testing practice lab designed specifically for Mac users.

## Scope
This lab provides a totally interactive space to test 40+ traditional web vulnerabilities and Next-Gen AI vulnerabilities (Prompt Injection, Bias, etc.).

## 🚀 Quick Start for Mac Users

### Requirements
You will need Docker.
If you do not have Docker installed, you can install it using Homebrew:
```bash
brew install --cask docker
```

*(Ensure the Docker Desktop app is running before proceeding.)*

### Getting Started
1. **Start the containers** across our two main environments (Web App on `:8080`, AI Microservice on `:3000`):
   ```bash
   docker compose up -d
   ```
2. **Access the Application**:
   Navigate to [http://localhost:8080](http://localhost:8080) in your modern browser.
3. **Logs & Debugging**:
   To view the application logs, which are extremely useful to see how your payloads are processed on the server-side:
   ```bash
   docker compose logs -f
   ```

### 🛑 Ethical Warning
**Strictly Local Only**
This application is intentionally vulnerable to RCE, SQLi, and over 40 other critical vulnerabilities. **Under no circumstances should you expose `docker-compose` to the public internet or external networks.**
- All simulated logs and exploits reset on container restart.
- Big Red Warning: Use this knowledge responsibly for educational and defensive purposes only.

### How to Play
- **Earn Badges**: As you successfully execute exploits, use the provided hints, and solve challenges, your gamified user state tracking will grant you levels and badges.
- **Combo Bosses**: Test combination attacks like `XSS + CSRF` in advanced challenges.
- **Reset State**: Just click the "Reset All" button in the dashboard, or run `docker compose down -v` to reset everything including the database.

## Extending the Guide
Want to add a new vulnerability?
1. Create a new file in `vulns/my_new_vuln.js`.
2. Ensure it exports `id`, `name`, `difficulty`, `theory`, `exploit`, `endpoint`, and an Express `router`.
3. Restart Docker Compose. The lab dynamically loads it automatically!
