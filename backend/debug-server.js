const { spawn } = require('child_process');
const path = require('path');

console.log('Starting debug server...');
console.log('Current directory:', __dirname);

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '3001';

// Start the server
const server = spawn('node', ['dist/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('exit', (code, signal) => {
  console.log(`Server exited with code ${code} and signal ${signal}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill();
});