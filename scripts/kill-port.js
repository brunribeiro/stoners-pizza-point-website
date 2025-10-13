#!/usr/bin/env node

const { execSync } = require('child_process');

const port = process.argv[2] || 3000;

console.log(`🔍 Checking for processes on port ${port}...`);

try {
  // For macOS/Linux, use lsof to find the process
  const command =
    process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;

  const output = execSync(command, { encoding: 'utf8' }).trim();

  if (output) {
    // Split by newlines to handle multiple PIDs
    const pids = output.split('\n').filter((pid) => pid.trim());

    pids.forEach((pid) => {
      console.log(`🔪 Killing process ${pid} on port ${port}...`);

      try {
        // Kill the process
        const killCommand =
          process.platform === 'win32' ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;

        execSync(killCommand);
        console.log(`✅ Successfully killed process ${pid}`);
      } catch (killError) {
        console.error(`❌ Failed to kill process ${pid}: ${killError.message}`);
      }
    });
  } else {
    console.log(`✅ No process found on port ${port}`);
  }
} catch (error) {
  // If no process is found, lsof returns error - this is fine
  if (error.status === 1) {
    console.log(`✅ No process found on port ${port}`);
  } else {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}
