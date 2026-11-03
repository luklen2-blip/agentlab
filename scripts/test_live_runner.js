const { spawn } = require('child_process');
const path = require('path');

const port = '3088';
const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, PORT: port }
});

serverProcess.stdout.on('data', d => console.log(`[SERVER] ${d.toString().trim()}`));
serverProcess.stderr.on('data', d => console.error(`[SERVER ERR] ${d.toString().trim()}`));

setTimeout(() => {
  const testProcess = spawn('node', ['tests/test_cloud_live.js', `http://localhost:${port}`], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });

  testProcess.on('exit', code => {
    serverProcess.kill('SIGTERM');
    process.exit(code);
  });
}, 1500);

