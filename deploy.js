const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO = process.argv[2] || 'ghost-cell';
const USER = process.argv[3] || 'YOUR_GITHUB_USERNAME';

// 1. Update config.js backend URL
const configPath = path.join(__dirname, 'docs', 'config.js');
let config = fs.readFileSync(configPath, 'utf8');
config = config.replace(/BACKEND_URL: '.*?'/, "BACKEND_URL: 'https://" + REPO + "-backend.onrender.com'");
fs.writeFileSync(configPath, config);

// 2. Init git and push
const cmds = [
  'git init',
  'git add -A',
  'git commit -m "Ghost Cell v1.0 — CATShadow"',
  'git branch -M main',
  'git remote add origin https://github.com/' + USER + '/' + REPO + '.git',
  'git push -u origin main'
];

console.log('[*] Deploying to GitHub: ' + USER + '/' + REPO);
for (const cmd of cmds) {
  console.log('  $ ' + cmd);
  try {
    exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) console.log('  [!] ' + err.message.slice(0, 80));
      if (stdout) console.log('  ' + stdout.trim().split('\n').join('\n  '));
    });
  } catch(e) {}
}
console.log('');
console.log('[*] After push:');
console.log('  1. GitHub > Settings > Pages');
console.log('  2. Source: Deploy from branch > main > /docs');
console.log('  3. URL: https://' + USER + '.github.io/' + REPO + '/');
console.log('');
console.log('[*] Then deploy backend on Render.com:');
console.log('  - Root dir: backend');
console.log('  - Start: node server.js');
console.log('  - Add TELEGRAM_TOKEN and TELEGRAM_CHAT env vars');
