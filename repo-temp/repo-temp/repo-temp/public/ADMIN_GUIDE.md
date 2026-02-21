# Evolution API - Admin Dashboard Guide

## Quick Start

1. **Access the Dashboard**
   - Open your browser and navigate to: `http://your-server:8080/admin.html`
   - For local: `http://localhost:8080/admin.html`
   - For Render: `https://your-app.onrender.com/admin.html`

2. **Enter Your API Key**
   - When prompted, enter your `AUTHENTICATION_API_KEY` from the `.env` file
   - Default from config: `429683C4C977415CAAFCCE10F7D57E11`

## Features

### 📱 Create New Instance

1. Enter an instance name (e.g., `marksheet-notifications`)
2. Select the integration type:
   - **WhatsApp Baileys**: For multi-device WhatsApp Web scraping
   - **WhatsApp Business**: For official WhatsApp Business API
3. (Optional) Enter phone number with country code
4. (Optional) Enable/disable automatic QR code generation
5. Click "Create Instance"
6. Scan the generated QR code with WhatsApp or use the pairing code

### ⚙️ Manage Instances

1. Select an instance from the dropdown
2. View current connection status:
   - **open**: Connected and active
   - **close**: Not connected
   - **connecting**: Attempting to connect
3. Available actions:
   - **Generate New QR Code**: Get a fresh QR code to reconnect
   - **Reconnect Instance**: Force reconnection to WhatsApp
   - **Disconnect & Logout**: Fully logout and disconnect the instance

### 📋 View All Instances

- See summary statistics:
  - Total instances created
  - Currently connected instances
  - Disconnected instances
- Quick access buttons for each instance:
  - Generate QR Code
  - Logout

## API Endpoints Used

The dashboard uses these Evolution API endpoints:

### Create Instance
```
POST /instance/create
Content-Type: application/json
apikey: YOUR_API_KEY

{
  "instanceName": "marksheet-notifications",
  "integration": "WHATSAPP-BAILEYS",
  "qrcode": true,
  "number": "918778439728"
}
```

### Generate QR Code
```
GET /instance/connect?instanceName=marksheet-notifications
apikey: YOUR_API_KEY
```

### Get Connection Status
```
GET /instance/connectionState?instanceName=marksheet-notifications
apikey: YOUR_API_KEY
```

### Fetch All Instances
```
GET /instance/fetchInstances
apikey: YOUR_API_KEY
```

### Logout Instance
```
DELETE /instance/logout
Content-Type: application/json
apikey: YOUR_API_KEY

{
  "instanceName": "marksheet-notifications"
}
```

## Common Issues & Solutions

### Issue: "API Key is invalid"
- **Solution**: Make sure you're using the correct `AUTHENTICATION_API_KEY` from your `.env` file
- Check your `.env` file for the correct key

### Issue: "QR code not loading"
- **Solution**: Make sure the instance is in "close" or "connecting" state
- Try clicking "Reconnect Instance" first, then "Generate New QR Code"

### Issue: "Instance not connecting after QR scan"
- **Solution**: 
  1. Make sure you're using a WhatsApp account with multi-device support enabled
  2. Go to WhatsApp Settings > Linked Devices
  3. Ensure your phone's WhatsApp is running in the background
  4. Refresh the QR code and try again

### Issue: "Cannot connect to API"
- **Solution**:
  1. Verify the API is running: `npm run start:prod`
  2. Check if port 8080 is accessible
  3. For Render, ensure the deployment completed successfully
  4. Check CORS settings in `.env`

## Connection States Explained

| State | Meaning | Action |
|-------|---------|--------|
| `open` | Connected and ready | Instance is active, no action needed |
| `close` | Not connected | Click "Generate New QR Code" or "Reconnect Instance" |
| `connecting` | Attempting to connect | Wait a moment, then refresh to see updated status |

## Best Practices

1. **Security**
   - Don't share your API key
   - Change the `AUTHENTICATION_API_KEY` in production
   - Use HTTPS in production (set `SERVER_TYPE=https` in `.env`)

2. **Instance Management**
   - Use descriptive instance names for easy identification
   - Keep phone numbers updated in the instance details
   - Regularly check instance health from the dashboard

3. **QR Code Generation**
   - Generate a new QR code if connection drops
   - Each QR code is valid for a limited time
   - Don't scan the same QR code multiple times

4. **Production Deployment**
   - Use environment variables for API keys
   - Set up proper CORS policies
   - Monitor instance connections regularly
   - Use webhooks to track instance events

## Troubleshooting

### Check Logs
```bash
# For Docker Compose
docker-compose logs -f evolution-api

# For local development
npm run start:dev
```

### Reset an Instance
```bash
# Logout the instance from dashboard
# Then create a new instance or reconnect

# Or use API directly:
curl -X DELETE http://localhost:8080/instance/logout \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_API_KEY" \
  -d '{"instanceName":"your-instance-name"}'
```

## Support

For issues and feature requests, please check:
- [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)
- Issue tracker for known problems

---

**Version**: 1.0
**Last Updated**: January 19, 2026
