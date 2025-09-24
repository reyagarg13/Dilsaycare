#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Starting Backend Debug Process...');
console.log('Working Directory:', process.cwd());

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run from backend directory.');
  process.exit(1);
}

// Build first
console.log('📦 Building backend...');
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Build failed with code ${code}`);
    process.exit(1);
  }
  
  console.log('✅ Build successful, starting server...');
  
  // Start server
  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '3001'
    }
  });
  
  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err.message);
  });
  
  serverProcess.on('close', (code, signal) => {
    console.log(`🛑 Server stopped with code ${code}, signal: ${signal}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down...');
    serverProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down...');
    serverProcess.kill('SIGINT');
  });
});