const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const logFile = path.join(__dirname, 'server.log');
const out = fs.openSync(logFile, 'a');
const err = fs.openSync(logFile, 'a');

const p = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, PORT: '3055' },
  detached: true,
  stdio: ['ignore', out, err]
});

p.unref();
console.log('Servidor iniciado com PID:', p.pid, 'na porta 3055');

