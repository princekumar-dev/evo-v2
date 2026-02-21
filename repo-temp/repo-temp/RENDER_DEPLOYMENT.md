# Evolution API - Render Deployment Guide

## PostgreSQL Database Configuration

The Evolution API has been configured to use an external PostgreSQL database on Render.

### Environment Variables to Set in Render Dashboard

When deploying on Render, add these environment variables to your service:

#### Required Environment Variables

1. **DATABASE_CONNECTION_URI** (Required)
   ```
   postgresql://evolution_db_2xzl_user:8V2hTQPqNlRT7BEcOun1BN4EmZxE9AwR@dpg-d5mjh24oud1c739effc0-a/evolution_db_2xzl
   ```
   - This is your Render PostgreSQL connection string
   - Contains all necessary credentials for database access

2. **AUTHENTICATION_API_KEY** (Required)
   ```
   Set a strong API key for authentication (e.g., BQYHJGJHJ)
   ```
   - Used to authenticate API requests to Evolution API

#### Optional Environment Variables

3. **SERVER_URL** 
   - Auto-configured to your Render service URL (https://your-service-name.onrender.com)
   - No need to set manually

4. **LOG_LEVEL**
   - Default: `ERROR,WARN,DEBUG,INFO,LOG,VERBOSE`
   - Adjust as needed for your environment

### Deployment Steps

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select this repository
4. Configure build and start commands (should auto-detect from render.yaml):
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
5. Add Environment Variables (from above)
6. Deploy!

### Database Migrations

The Evolution API automatically runs database migrations on startup:
- Migrations are executed via `Docker/scripts/deploy_database.sh`
- Prisma migrations are applied based on `DATABASE_PROVIDER` setting
- No manual migration steps required

### Important Notes

- ✅ Docker image does NOT include hardcoded .env files
- ✅ All configuration comes from Render environment variables
- ✅ Connection string is securely injected at runtime
- ✅ Local Redis cache enabled for performance (Redis disabled)
- ✅ Health check endpoint: `/info` (30-second interval)

### Troubleshooting

**Migration Failed**: Check DATABASE_CONNECTION_URI is correct
**Service Won't Start**: Verify AUTHENTICATION_API_KEY is set
**Database Connection Timeout**: Ensure Render PostgreSQL database is accessible

### File References

- **render.yaml** - Render deployment configuration
- **Dockerfile** - Docker image definition (uses environment variables)
- **env.example** - Example environment configuration
- **Docker/scripts/deploy_database.sh** - Database migration script
