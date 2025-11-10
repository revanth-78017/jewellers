#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Verification script to check if all required API keys are configured
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local file not found!', 'red');
    log('\n📝 Please create a .env.local file with your API keys.', 'yellow');
    log('   See .env.example or API_KEYS_SETUP.md for details.\n', 'yellow');
    return false;
  }
  
  log('✅ .env.local file exists', 'green');
  return true;
}

function checkEnvVariables() {
  const requiredVars = [
    { key: 'OPENAI_API_KEY', description: 'OpenAI API for DALL-E 3', prefix: 'sk-' },
    { key: 'UNSPLASH_ACCESS_KEY', description: 'Unsplash API', prefix: null },
    { key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', description: 'Cloudinary Cloud Name', prefix: null },
    { key: 'CLOUDINARY_API_KEY', description: 'Cloudinary API Key', prefix: null },
    { key: 'CLOUDINARY_API_SECRET', description: 'Cloudinary API Secret', prefix: null },
  ];

  const optionalVars = [
    { key: 'LANGCHAIN_API_KEY', description: 'LangSmith API (optional)', prefix: 'ls__' },
  ];

  log('\n🔍 Checking required environment variables:\n', 'cyan');

  let allPresent = true;
  
  // Check required variables
  for (const variable of requiredVars) {
    const value = process.env[variable.key];
    
    if (!value || value === 'your_' + variable.key.toLowerCase() + '_here') {
      log(`❌ ${variable.key} - Missing or using placeholder`, 'red');
      log(`   ${variable.description}`, 'yellow');
      allPresent = false;
    } else if (variable.prefix && !value.startsWith(variable.prefix)) {
      log(`⚠️  ${variable.key} - Present but may be invalid (should start with "${variable.prefix}")`, 'yellow');
      log(`   Current value starts with: ${value.substring(0, 10)}...`, 'yellow');
    } else {
      log(`✅ ${variable.key} - Configured`, 'green');
    }
  }

  log('\n🔍 Checking optional environment variables:\n', 'cyan');

  // Check optional variables
  for (const variable of optionalVars) {
    const value = process.env[variable.key];
    
    if (!value || value === 'your_' + variable.key.toLowerCase() + '_here') {
      log(`⚠️  ${variable.key} - Not configured (${variable.description})`, 'yellow');
    } else {
      log(`✅ ${variable.key} - Configured`, 'green');
    }
  }

  return allPresent;
}

function checkNodeModules() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('\n❌ node_modules not found!', 'red');
    log('   Run: npm install\n', 'yellow');
    return false;
  }
  
  // Check for key packages
  const requiredPackages = ['openai', 'unsplash-js', 'cloudinary', 'next'];
  const missingPackages = [];
  
  for (const pkg of requiredPackages) {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      missingPackages.push(pkg);
    }
  }
  
  if (missingPackages.length > 0) {
    log(`\n⚠️  Missing packages: ${missingPackages.join(', ')}`, 'yellow');
    log('   Run: npm install\n', 'yellow');
    return false;
  }
  
  log('\n✅ All required packages installed', 'green');
  return true;
}

function printNextSteps(allConfigured) {
  log('\n' + '='.repeat(60), 'cyan');
  
  if (allConfigured) {
    log('\n🎉 Setup Complete!', 'green');
    log('\n📋 Next steps:', 'cyan');
    log('   1. Run: npm run dev', 'blue');
    log('   2. Open: http://localhost:3000', 'blue');
    log('   3. Test AI generation at: /design', 'blue');
    log('   4. Test gallery at: /gallery', 'blue');
  } else {
    log('\n⚠️  Setup Incomplete', 'yellow');
    log('\n📋 Next steps:', 'cyan');
    log('   1. Add missing API keys to .env.local', 'blue');
    log('   2. See API_KEYS_SETUP.md for detailed instructions', 'blue');
    log('   3. Run this script again to verify: npm run verify', 'blue');
  }
  
  log('\n📚 Documentation:', 'cyan');
  log('   - README.md - Project overview and setup', 'blue');
  log('   - API_KEYS_SETUP.md - Detailed API keys guide', 'blue');
  log('\n' + '='.repeat(60) + '\n', 'cyan');
}

// Main execution
function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🔧 Jewelry App - Environment Setup Verification', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  const hasEnvFile = checkEnvFile();
  
  if (!hasEnvFile) {
    printNextSteps(false);
    process.exit(1);
  }

  // Load .env.local manually for this script
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });

  const allConfigured = checkEnvVariables();
  const packagesInstalled = checkNodeModules();

  printNextSteps(allConfigured && packagesInstalled);

  if (!allConfigured || !packagesInstalled) {
    process.exit(1);
  }
}

main();

