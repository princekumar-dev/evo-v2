#!/usr/bin/env node
/**
 * Database initialization for Evolution API on Render
 * Runs Prisma migrations before starting the app
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Determine the correct Prisma schema file based on DATABASE_PROVIDER.
 * - 'psql_bouncer' uses psql_bouncer-schema.prisma (pooled connection via Supabase Supavisor)
 * - 'mysql' uses mysql-schema.prisma
 * - default: postgresql-schema.prisma
 */
function getSchemaFile(provider) {
  switch (provider) {
    case 'psql_bouncer':
      return './prisma/psql_bouncer-schema.prisma';
    case 'mysql':
      return './prisma/mysql-schema.prisma';
    default:
      return './prisma/postgresql-schema.prisma';
  }
}

/**
 * Determine which migrations folder to copy based on DATABASE_PROVIDER.
 * psql_bouncer reuses postgresql migrations.
 */
function getMigrationsFolder(provider) {
  switch (provider) {
    case 'psql_bouncer':
      return 'postgresql-migrations';
    case 'mysql':
      return 'mysql-migrations';
    default:
      return 'postgresql-migrations';
  }
}

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

    const dbProvider = process.env.DATABASE_PROVIDER || 'postgresql';
    const schemaFile = getSchemaFile(dbProvider);
    const migrationsSource = getMigrationsFolder(dbProvider);

    // Debug: Check database connection variables
    console.log('🔍 Environment Check:');
    console.log(`- DATABASE_PROVIDER: ${dbProvider}`);
    console.log(`- Schema file: ${schemaFile}`);
    console.log(`- Migrations source: ${migrationsSource}`);
    console.log(`- DATABASE_CONNECTION_URI: ${process.env.DATABASE_CONNECTION_URI ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`- DATABASE_BOUNCER_CONNECTION_URI: ${process.env.DATABASE_BOUNCER_CONNECTION_URI ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}\n`);

    // Clean up old Prisma generated files
    console.log('0️⃣  Cleaning up old Prisma files...');
    if (fs.existsSync('./node_modules/.prisma')) {
      fs.rmSync('./node_modules/.prisma', { recursive: true });
    }
    
    // Copy migrations
    const migrationsSourcePath = `./prisma/${migrationsSource}`;
    console.log(`1️⃣  Copying migrations from ${migrationsSource}...`);
    if (fs.existsSync('./prisma/migrations')) {
      fs.rmSync('./prisma/migrations', { recursive: true });
    }
    if (fs.existsSync(migrationsSourcePath)) {
      fs.cpSync(migrationsSourcePath, './prisma/migrations', { recursive: true });
      console.log('✅ Migrations copied\n');
    } else {
      console.log(`⚠️  Migrations folder ${migrationsSourcePath} not found, skipping copy\n`);
    }

    // Run migrations using db push for bouncer (pooled) connections,
    // since 'migrate deploy' requires a direct connection which may be
    // unreachable from hosted environments like Render.
    console.log('2️⃣  Deploying database schema...');
    if (dbProvider === 'psql_bouncer') {
      // For psql_bouncer: try migrate deploy first (uses directUrl internally),
      // if that fails fall back to db push which works over the pooled connection.
      const migrateCode = await runCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', schemaFile]);
      if (migrateCode !== 0) {
        console.log('⚠️  migrate deploy failed (direct connection likely unreachable), falling back to prisma db push...');
        const pushCode = await runCommand('npx', ['prisma', 'db', 'push', '--schema', schemaFile, '--accept-data-loss']);
        if (pushCode !== 0) {
          console.error('❌ Database schema push failed');
          process.exit(1);
        }
      }
    } else {
      const migrateCode = await runCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', schemaFile]);
      if (migrateCode !== 0) {
        console.error('❌ Database migration failed');
        process.exit(1);
      }
    }
    console.log('✅ Database schema up to date\n');

    // Generate Prisma client
    console.log('3️⃣  Generating Prisma client...');
    const genCode = await runCommand('npx', ['prisma', 'generate', '--schema', schemaFile]);
    if (genCode !== 0) {
      console.error('❌ Prisma client generation failed');
      process.exit(1);
    }
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
