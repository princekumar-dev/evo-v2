#!/usr/bin/env node
/**
 * Database initialization for Evolution API on Render
 * Runs Prisma migrations before starting the app
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`▶️  Running: ${cmd} ${args.join(' ')}`);
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    proc.on('close', code => {
      console.log(`✅ Command completed with code ${code}`);
      resolve(code);
    });

    proc.on('error', (err) => {
      console.error(`❌ Command error:`, err);
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('🔧 Initializing Evolution API...');
    console.log('📊 Setting up database...\n');

    // Debug: Check database connection variables
    console.log('🔍 Environment Check:');
    console.log(`- DATABASE_CONNECTION_URI: ${process.env.DATABASE_CONNECTION_URI ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`- DATABASE_PROVIDER: ${process.env.DATABASE_PROVIDER || 'NOT SET'}\n`);

    // Clean up old Prisma generated files
    console.log('0️⃣  Cleaning up old Prisma files...');
    if (fs.existsSync('./node_modules/.prisma')) {
      fs.rmSync('./node_modules/.prisma', { recursive: true });
    }
    
    // Copy migrations
    console.log('1️⃣  Copying PostgreSQL migrations...');
    if (fs.existsSync('./prisma/migrations')) {
      fs.rmSync('./prisma/migrations', { recursive: true });
    }
    fs.cpSync('./prisma/postgresql-migrations', './prisma/migrations', { recursive: true });
    console.log('✅ Migrations copied\n');

    // Run migrations
    console.log('2️⃣  Deploying database migrations...');
    await runCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', './prisma/postgresql-schema.prisma']);
    console.log('✅ Database migrations complete\n');

    // Generate Prisma client
    console.log('3️⃣  Generating Prisma client...');
    await runCommand('npx', ['prisma', 'generate', '--schema', './prisma/postgresql-schema.prisma']);
    console.log('✅ Prisma client regenerated\n');

    console.log('✅ Initialization complete\n');
    console.log('🚀 Starting Evolution API...\n');

    // Start the app
    require('child_process').execSync('node ./dist/main.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Initialization failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
