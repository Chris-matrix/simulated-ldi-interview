// Script to unlink project from Vercel
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if .vercel directory exists and remove it
const vercelDir = path.join(__dirname, '.vercel');
if (fs.existsSync(vercelDir)) {
  console.log('Removing .vercel directory...');
  fs.rmSync(vercelDir, { recursive: true, force: true });
  console.log('.vercel directory removed successfully.');
} else {
  console.log('No .vercel directory found.');
}

// Check if vercel.json exists and remove it
const vercelConfigFile = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigFile)) {
  console.log('Removing vercel.json file...');
  fs.unlinkSync(vercelConfigFile);
  console.log('vercel.json file removed successfully.');
} else {
  console.log('No vercel.json file found.');
}

// Check if project has Vercel CLI installed
try {
  console.log('Checking if Vercel CLI is installed...');
  execSync('npx vercel --version', { stdio: 'ignore' });
  
  // If we get here, Vercel CLI is available
  console.log('Vercel CLI found. To completely unlink this project, you may also want to run:');
  console.log('npx vercel logout');
  console.log('This will log you out of the Vercel CLI if you\'re logged in.');
} catch (error) {
  console.log('Vercel CLI not found or not installed.');
}

console.log('\nProject has been unlinked from Vercel configuration files.');
console.log('Note: If this project is deployed to Vercel, you may also want to:');
console.log('1. Log in to your Vercel dashboard (https://vercel.com/dashboard)');
console.log('2. Find this project');
console.log('3. Go to project settings');
console.log('4. Delete the project or disconnect it from your Git repository');
