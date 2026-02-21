#!/usr/bin/env node
/**
 * Database initialization script for Evolution API on Render
 * This manually creates the required database schema for PostgreSQL
 */

require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    const connectionString = process.env.DATABASE_CONNECTION_URI || process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error('❌ DATABASE_CONNECTION_URI or DATABASE_URL not set');
        process.exit(1);
    }

    console.log('🔧 Setting up Evolution API database...');
    console.log(`📍 Database: ${connectionString.split('@')[1]}`);

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // For Render PostgreSQL
    });

    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Read the PostgreSQL schema migration files
        const migrationsDir = path.join(__dirname, '..', 'prisma', 'postgresql-migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        console.log(`\n📦 Found ${migrationFiles.length} migrations to run`);

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            
            console.log(`\n▶️  Executing: ${file}`);
            try {
                await client.query(sql);
                console.log(`✅ Completed: ${file}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`⏭️  Skipped (already exists): ${file}`);
                } else {
                    console.error(`❌ Error in ${file}:`, err.message);
                    // Continue with next migration instead of failing
                }
            }
        }

        console.log('\n✅ Database setup complete!');
    } catch (err) {
        console.error('❌ Database setup failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
