#!/bin/bash

# Initialize Evolution API database on Render
# This script should be run once to set up the database schema

echo "Setting up Evolution API database..."

# Export environment variables from .env if needed
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

echo "Database URL: $DATABASE_URL"
echo "Database Provider: $DATABASE_PROVIDER"

# Run Prisma migrations
echo "Running Prisma migrations..."
npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete"
else
    echo "❌ Database setup failed"
    exit 1
fi

# Generate Prisma client
npm run db:generate

echo "Done!"
