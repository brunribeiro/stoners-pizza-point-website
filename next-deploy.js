const shell = require('shelljs');

const { exec, rm, cp, env, echo } = shell;

try {
  echo('Starting the update build process...');

  // Install dependencies
  echo('Installing dependencies...');
  const installResult = exec('yarn install');
  if (installResult.code !== 0) {
    echo('Error: Failed to install dependencies.');
    shell.exit(1);
  }

  // Set temporary build directory
  env['BUILD_DIR'] = 'build';

  // Run build process
  echo('Building the application...');
  const buildResult = exec('yarn build');
  if (buildResult.code !== 0) {
    echo('Error: Build process failed.');
    shell.exit(1);
  }

  // Copy build to .next directory
  echo('Copying build to .next...');
  cp('-R', 'build/*', '.next/');

  // Remove temporary build directory
  echo('Cleaning up temporary build directory...');
  rm('-rf', 'build');

  // Reset environment variable (optional)
  env['BUILD_DIR'] = '.next';

  echo('Build and deployment process completed successfully.');
} catch (error) {
  echo('Error occurred during deployment:', error);
  shell.exit(1);
}
