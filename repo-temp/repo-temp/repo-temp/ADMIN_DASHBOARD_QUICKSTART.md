# Admin Dashboard - Quick Start Guide

## 🎉 What's New

Your Evolution API now has a fully functional **Admin Dashboard** for managing WhatsApp instances!

## 📍 Access the Dashboard

### Local Development
```
http://localhost:8080/admin.html
```

### Production (Render)
```
https://your-app.onrender.com/admin.html
```

## 🔑 API Key Setup

When you open the dashboard, it will prompt you for your API key.

**Default API Key:**
```
429683C4C977415CAAFCCE10F7D57E11
```

This is from your `.env` file:
```
AUTHENTICATION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
```

> **⚠️ Security Tip**: Change this key in production to a secure random value.

## 🚀 Features

### 1. **Create New Instance**
- Enter instance name (e.g., `marksheet-notifications`)
- Select integration type (WhatsApp Baileys or Business)
- Optionally enter phone number
- Click "Create Instance"
- Scan the generated QR code with WhatsApp

### 2. **Manage Instances**
- Select an instance from the dropdown
- View real-time connection status
- Generate new QR codes if needed
- Reconnect to WhatsApp
- Disconnect/Logout instances

### 3. **Instance Dashboard**
- See all instances at a glance
- View statistics (total, connected, disconnected)
- Quick actions for each instance
- Real-time status updates every 10 seconds

## 📱 Connection States

| State | Meaning | Next Step |
|-------|---------|-----------|
| **open** | Connected and active | ✅ Ready to use |
| **close** | Not connected | 🔄 Generate QR Code |
| **connecting** | Attempting to connect | ⏳ Wait and check status |

## 🎯 Common Workflows

### Create and Connect a New Instance

1. Go to **"Create New Instance"** section
2. Enter instance name: `marksheet-notifications`
3. Select: **WhatsApp Baileys**
4. Check: **"Generate QR Code on creation"**
5. Click: **"Create Instance"**
6. Scan the QR code with WhatsApp:
   - Open WhatsApp on your phone
   - Go to **Settings** → **Linked Devices**
   - Tap **"Link a Device"**
   - Scan the code from the dashboard
7. The instance will connect automatically

### Reconnect a Disconnected Instance

1. Go to **"Manage Instances"** section
2. Select the instance from the dropdown
3. Click: **"Generate New QR Code"**
4. Scan with WhatsApp (same steps as above)

### Disconnect an Instance

1. Go to **"Manage Instances"** section
2. Select the instance from the dropdown
3. Click: **"Disconnect & Logout"**
4. Confirm the action
5. Instance will be logged out

## 🔧 Troubleshooting

### Issue: Can't connect to API
**Solution:**
- Ensure the server is running on port 8080
- Check if you're using the correct URL
- Verify API key is correct
- Check CORS settings in `.env`

### Issue: QR Code doesn't appear
**Solution:**
- Ensure instance is in "close" or "connecting" state
- Try clicking "Reconnect Instance" first
- Refresh the page
- Check browser console for errors

### Issue: Can't scan QR code
**Solution:**
- Make sure WhatsApp is running on your phone
- Ensure your phone has internet connection
- Try the pairing code alternative (if available)
- Generate a new QR code and try again

### Issue: Instance keeps disconnecting
**Solution:**
- Keep WhatsApp running in the background on your phone
- Ensure stable internet connection
- Check the Render deployment logs
- Try reconnecting manually from dashboard

## 📊 API Endpoints Used

The dashboard internally uses these endpoints:

```
POST   /instance/create              - Create a new instance
GET    /instance/connect             - Get QR code / reconnect
GET    /instance/connectionState     - Get instance status
GET    /instance/fetchInstances      - List all instances
DELETE /instance/logout              - Disconnect instance
```

All requests require the `apikey` header with your API key.

## 📚 Full Documentation

For detailed API documentation and advanced usage, see:
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- [Evolution API Docs](https://evolution-api.com)

## 🐛 Known Limitations

1. **QR Code Expiry**: QR codes are valid for a limited time. If expired, generate a new one.
2. **Single Device**: Each WhatsApp account can only be linked to one device at a time.
3. **Session Persistence**: Instances require internet connection to stay active.
4. **Rate Limiting**: API has rate limits to prevent abuse.

## 💡 Pro Tips

1. **Bulk Testing**: Create multiple instances with sequential numbers for load testing
2. **Monitor Dashboard**: Keep the dashboard open to monitor instance health
3. **Backup**: Regularly export instance configurations
4. **Security**: Rotate your API key regularly in production
5. **Logging**: Check logs for detailed troubleshooting:
   ```bash
   # Docker logs
   docker-compose logs -f evolution-api
   
   # Local logs
   npm run start:dev
   ```

## 🔐 Security Notes

- **Never share your API key** - It grants full access to your instances
- **Use HTTPS in production** - Set `SERVER_TYPE=https` in `.env`
- **Change default API key** - Set a strong random key for production
- **Restrict CORS** - Limit to specific domains in `CORS_ORIGIN`
- **Enable authentication** - Use API key validation on all endpoints

## ✅ Feature Checklist

- [x] Admin dashboard UI
- [x] Create instances
- [x] Generate QR codes
- [x] Manage connections
- [x] Disconnect instances
- [x] Real-time status updates
- [x] Instance statistics
- [x] Responsive design
- [x] Error handling
- [x] Documentation

## 📞 Need Help?

If you encounter issues:

1. Check the [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed documentation
2. Review API logs: Check browser console (F12) for errors
3. Check server logs: `docker-compose logs evolution-api`
4. Visit [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)

---

**Version**: 1.0  
**Last Updated**: January 19, 2026  
**Status**: ✅ Production Ready
