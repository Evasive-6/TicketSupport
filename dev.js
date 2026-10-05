import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

console.log('----------------------------------------------------');
console.log('🚀 Starting SupportPulse Full-Stack Development Environment');
console.log('   Backend API:  http://localhost:5000');
console.log('   Frontend App: http://localhost:5173');
console.log('----------------------------------------------------\n');

// 1. Start Backend Server
const backend = spawn('node', ['src/server.js'], {
  cwd: path.resolve(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[BACKEND]\x1b[0m ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[BACKEND ERROR]\x1b[0m ${data}`);
});

// 2. Start Frontend Vite Dev Server
const frontend = spawn(npxCmd, ['vite'], {
  cwd: path.resolve(__dirname, 'frontend'),
  stdio: 'pipe',
  shell: true
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[35m[FRONTEND]\x1b[0m ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[FRONTEND INFO]\x1b[0m ${data}`);
});

// Handle graceful termination
function shutdown() {
  console.log('\n🛑 Gracefully shutting down full-stack development processes...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
