#!/bin/bash

# Evolution API - Admin Dashboard Quick Test
# This script helps you test the admin dashboard functionality

API_KEY="429683C4C977415CAAFCCE10F7D57E11"
API_URL="https://evolution-eezv.onrender.com"  # Change to your deployment URL

echo "================================================"
echo "Evolution API - Admin Dashboard Test"
echo "================================================"
echo "API URL: $API_URL"
echo "API Key: $API_KEY"
echo ""

# Test 1: Create Instance
echo "1️⃣  Creating instance 'test-instance'..."
INSTANCE_RESPONSE=$(curl -s -X POST "$API_URL/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: $API_KEY" \
  -d '{
    "instanceName": "test-instance",
    "integration": "WHATSAPP-BAILEYS",
    "qrcode": true
  }')

echo "Response: $INSTANCE_RESPONSE"
echo ""

# Test 2: Get QR Code
echo "2️⃣  Getting QR code for instance..."
QR_RESPONSE=$(curl -s -X GET "$API_URL/instance/connect?instanceName=test-instance" \
  -H "apikey: $API_KEY")

echo "Response: $QR_RESPONSE"
echo ""

# Test 3: Get Instance Status
echo "3️⃣  Checking instance status..."
STATUS_RESPONSE=$(curl -s -X GET "$API_URL/instance/connectionState?instanceName=test-instance" \
  -H "apikey: $API_KEY")

echo "Response: $STATUS_RESPONSE"
echo ""

echo "================================================"
echo "✅ Test complete! Open your dashboard at:"
echo "   $API_URL/admin.html"
echo "================================================"
