# Evolution API - Admin Dashboard Quick Test Script
# Windows PowerShell Version

$API_KEY = "429683C4C977415CAAFCCE10F7D57E11"
$API_URL = "https://evolution-eezv.onrender.com"  # Change to your deployment URL

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Evolution API - Admin Dashboard Test" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "API URL: $API_URL" -ForegroundColor Yellow
Write-Host "API Key: $API_KEY" -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
    "apikey" = $API_KEY
}

# Test 1: Create Instance
Write-Host "1️⃣  Creating instance 'test-instance'..." -ForegroundColor Green

try {
    $createBody = @{
        instanceName = "test-instance"
        integration = "WHATSAPP-BAILEYS"
        qrcode = $true
    } | ConvertTo-Json

    $createResponse = Invoke-WebRequest -Uri "$API_URL/instance/create" `
        -Method POST `
        -Headers $headers `
        -Body $createBody `
        -UseBasicParsing

    $createData = $createResponse.Content | ConvertFrom-Json
    Write-Host "✅ Instance created!" -ForegroundColor Green
    Write-Host "Instance Name: $($createData.instance.instanceName)" -ForegroundColor Cyan
    Write-Host "Instance ID: $($createData.instance.instanceId)" -ForegroundColor Cyan
    
    if ($createData.qrcode.base64) {
        Write-Host "✅ QR Code Generated!" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get QR Code
Write-Host "2️⃣  Getting QR code for instance..." -ForegroundColor Green

try {
    $qrResponse = Invoke-WebRequest -Uri "$API_URL/instance/connect?instanceName=test-instance" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $qrData = $qrResponse.Content | ConvertFrom-Json
    
    if ($qrData.qrcode) {
        Write-Host "✅ QR Code available!" -ForegroundColor Green
        
        if ($qrData.qrcode.pairingCode) {
            Write-Host "Pairing Code: $($qrData.qrcode.pairingCode)" -ForegroundColor Yellow
        }
    }
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Instance Status
Write-Host "3️⃣  Checking instance status..." -ForegroundColor Green

try {
    $statusResponse = Invoke-WebRequest -Uri "$API_URL/instance/connectionState?instanceName=test-instance" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing

    $statusData = $statusResponse.Content | ConvertFrom-Json
    Write-Host "✅ Status retrieved!" -ForegroundColor Green
    Write-Host "Instance State: $($statusData.instance.state)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Test complete!" -ForegroundColor Green
Write-Host "📱 Open your dashboard at:" -ForegroundColor Yellow
Write-Host "   $API_URL/admin.html" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Optional: Open dashboard in browser
$openBrowser = Read-Host "Open dashboard in browser? (y/n)"
if ($openBrowser -eq 'y') {
    Start-Process "$API_URL/admin.html"
}
