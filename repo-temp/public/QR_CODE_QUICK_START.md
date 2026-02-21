# 🚀 Quick Start: Generate QR Code from Admin Dashboard

## Step 1: Access the Dashboard

Open your browser and go to:

**For Render Deployment:**
```
https://evolution-eezv.onrender.com/admin.html
```

**For Local Development:**
```
http://localhost:8080/admin.html
```

## Step 2: Enter API Key

When the page loads, a popup will ask for your API key. Enter:
```
429683C4C977415CAAFCCE10F7D57E11
```

## Step 3: Create an Instance

In the **"Create New Instance"** section:

1. **Instance Name**: Enter a name (e.g., `marksheet-notifications`)
2. **Integration Type**: Select `WHATSAPP-BAILEYS`
3. **Phone Number** (optional): Enter with country code (e.g., `918778439728`)
4. **Generate QR Code**: Check the box (default: checked)
5. Click **"Create Instance"** button

**Result**: You'll see a QR code appear on the screen.

## Step 4: Scan the QR Code

On your phone:
1. Open **WhatsApp**
2. Go to **Settings → Linked Devices**
3. Click **"Link a Device"** (or use pairing code if displayed)
4. **Scan the QR code** shown on the dashboard
5. Wait for connection to establish (2-5 seconds)

## Step 5: Manage the Instance

Once created, you can:

### Generate New QR Code
- Select the instance from the dropdown in "Manage Instances" section
- Click **"🔄 Generate New QR Code"**
- A fresh QR code will appear

### Check Connection Status
- The status updates automatically
- You'll see `open` (connected), `close` (disconnected), or `connecting`

### Disconnect Instance
- Click **"❌ Disconnect & Logout"**
- Confirm the action
- The instance will be logged out from WhatsApp

### Reconnect
- Click **"🔗 Reconnect Instance"**
- Get a new QR code if needed

---

## 🎯 Button Functions

| Button | Action |
|--------|--------|
| **Create Instance** | Creates a new WhatsApp instance with QR code |
| **🔄 Generate New QR Code** | Gets a fresh QR code for reconnection |
| **🔗 Reconnect Instance** | Force reconnection to WhatsApp servers |
| **❌ Disconnect & Logout** | Fully logout and clear the instance |
| **Refresh Status** | Updates the connection status |

---

## ⚠️ Troubleshooting

### Problem: "Failed to get QR code"
**Solution:**
- Make sure the instance exists (create it first)
- Check instance is in `close` state
- Verify API key is correct

### Problem: "Instance not found"
**Solution:**
- The instance hasn't been created yet
- Go to "Create New Instance" section
- Create an instance first

### Problem: QR code doesn't work
**Solution:**
- Make sure WhatsApp is installed on your phone
- Ensure multi-device support is enabled
- WhatsApp must be running in background
- Try generating a new QR code

### Problem: Can't connect to API
**Solution:**
- Verify the API URL is correct
- Check if the server is running: `npm run start:prod`
- Ensure port 8080 is not blocked
- For Render: check if deployment is complete

---

## 📊 Real-time Stats

The dashboard shows:
- **Total Instances**: All instances created
- **Connected**: Active instances (status: open)
- **Disconnected**: Inactive instances (status: close)

---

## 🔒 Security Notes

1. **Keep API Key Secret**: Don't share `AUTHENTICATION_API_KEY`
2. **Use HTTPS in Production**: Set `SERVER_TYPE=https` in `.env`
3. **Update Default Key**: Change the default key for security
4. **Secure Deployment**: Use environment variables for sensitive data

---

## 📱 What Happens After You Scan?

1. **Instant**: Phone shows the linked device
2. **2-5 seconds**: Evolution API receives the connection
3. **Status Updates**: Dashboard shows `open` and connection time
4. **Ready**: You can now send messages via API

---

## 🔄 Advanced: Direct API Calls

### Create Instance
```bash
curl -X POST https://evolution-eezv.onrender.com/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: 429683C4C977415CAAFCCE10F7D57E11" \
  -d '{
    "instanceName": "my-instance",
    "integration": "WHATSAPP-BAILEYS",
    "qrcode": true
  }'
```

### Get QR Code
```bash
curl -X GET "https://evolution-eezv.onrender.com/instance/connect?instanceName=my-instance" \
  -H "apikey: 429683C4C977415CAAFCCE10F7D57E11"
```

### Logout Instance
```bash
curl -X DELETE https://evolution-eezv.onrender.com/instance/logout \
  -H "Content-Type: application/json" \
  -H "apikey: 429683C4C977415CAAFCCE10F7D57E11" \
  -d '{"instanceName":"my-instance"}'
```

---

## 🚀 Next Steps

After connecting:
1. Test sending messages via the API
2. Set up webhooks for message notifications
3. Configure backup providers for reliability
4. Monitor connection health

**Questions?** Check the full documentation in `ADMIN_GUIDE.md`
