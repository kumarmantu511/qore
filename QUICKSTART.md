# QoreChain Auto Bot - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
npx playwright install chromium
```

### Step 2: Run the Bot
**Option A - Single Account (Recommended for testing):**
```bash
npm run dev
```

**Option B - Multiple Accounts:**
Edit `src/multi-account-runner.ts` to change the count, then run:
```bash
npm run multi
```

### Step 3: View Dashboard
```bash
npm run dashboard
```

Or simply open `dashboard/index.html` in your browser.

---

## 📋 What You Need to Know

### How It Works

1. **Bot launches browser** (visible window, not headless)
2. **Navigates to signup page** automatically
3. **Generates random credentials**:
   - Email: `qoreuser4729@gmail.com` (random number + domain)
   - Password: `Xy9#aB2kL5mN` (12 chars, meets all requirements)
4. **Fills and submits form**
5. **Accepts Terms of Service** (auto-scrolls and clicks accept)
6. **Extracts wallet address** from dashboard
7. **Saves everything** to `data/wallets.json`
8. **Closes browser**

### File Locations

- **Wallet Data**: `data/wallets.json` - All accounts and wallet addresses
- **Screenshots**: `screenshots/` - Error screenshots for debugging
- **Dashboard**: `dashboard/index.html` - Web interface to view wallets

### Configuration Options

Edit `src/bot.ts`:

```typescript
const CONFIG = {
  headless: false,      // true = invisible browser, false = visible
  slowMo: 100,          // Delay between actions (milliseconds)
  timeout: 60000,       // Page load timeout (milliseconds)
  maxRetries: 3         // Retry attempts on failure
};
```

---

## 🎯 Common Use Cases

### Use Case 1: Test One Account
```bash
npm run dev
```
Watch the browser open and fill forms automatically.

### Use Case 2: Create 10 Accounts Sequentially
1. Edit `src/multi-account-runner.ts`:
   ```typescript
   const CONFIG: RunConfig = {
     count: 10,
     delayBetweenRuns: 5000
   };
   ```
2. Run:
   ```bash
   npm run multi
   ```

### Use Case 3: View All Wallets
1. Open dashboard:
   ```bash
   npm run dashboard
   ```
2. Or open `data/wallets.json` in a text editor

### Use Case 4: Run in Background (Production)
1. Edit `src/bot.ts`:
   ```typescript
   headless: true
   ```
2. Build and run:
   ```bash
   npm run build
   npm start
   ```

---

## 🔧 Troubleshooting

### Problem: "Browser doesn't open"
**Solution:**
```bash
npx playwright install chromium
```

### Problem: "Wallet address not found"
The bot couldn't automatically extract the wallet address. Check:
- `screenshots/` folder for what happened
- `data/wallets.json` - account may still be created

### Problem: "Form submission failed"
Try:
1. Increase timeout in `src/bot.ts` to `90000`
2. Check internet connection
3. Verify signup URL works in regular browser

### Problem: "Terms acceptance fails"
The terms page structure may have changed. The bot will:
- Skip if no accept button found
- Continue to next step
- Still try to extract wallet address

---

## 📊 Dashboard Features

The dashboard (`dashboard/index.html`) provides:

- **Real-time Statistics**
  - Total wallets created
  - Active wallets (successful)
  - Error wallets (failed)

- **Wallet Table**
  - Email and password (click to copy)
  - Wallet address (click to copy full address)
  - Creation timestamp
  - Status badge (Active/Error/Pending)
  - Delete button

- **Auto-refresh** every 30 seconds

---

## 💡 Tips & Best Practices

1. **Start with visible browser** (`headless: false`) to see what's happening
2. **Check screenshots** if something goes wrong
3. **Use delays** between multiple accounts (5+ seconds)
4. **Monitor the console** for real-time status updates
5. **Backup `data/wallets.json`** regularly

---

## ⚠️ Important Notes

### Legal & Ethical Use
- ✅ Testing and development purposes
- ✅ Learning browser automation
- ❌ Mass account creation for abuse
- ❌ Violating QoreChain Terms of Service

### Security
- All data stored locally in `data/wallets.json`
- No external API calls except to QoreChain
- Keep your wallet data secure
- Don't share your `wallets.json` file

---

## 🆘 Need Help?

1. **Check console output** - Detailed error messages shown
2. **Review screenshots** - Visual debugging in `screenshots/` folder
3. **Verify prerequisites** - Node.js 18+, Playwright installed
4. **Test manually** - Try the signup flow in regular browser first

---

## 📝 Example Output

When you run the bot, you'll see:

```
============================================================
🤖 Starting QoreChain Bot
============================================================
📧 Email: qoreuser4729@gmail.com
🔑 Password: Xy9#aB2kL5mN
============================================================
🚀 Launching browser...
✓ Browser launched
📍 Navigating to signup page...
✓ Signup page loaded
📝 Filling signup form...
✓ Form filled
🔘 Submitting form...
✓ Form submitted
📄 Looking for terms of service...
✓ Terms page found
📜 Scrolling through terms...
🔘 Accepting terms...
✓ Terms accepted
💼 Extracting wallet address...
✓ Wallet address found: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
✅ Account created successfully!
✓ Wallet saved for qoreuser4729@gmail.com

⏱️ Completed in 23.45s
🔒 Closing browser...
✓ Browser closed

✨ Bot execution complete!
```

---

## 🎉 Success Indicators

You'll know it worked when you see:
- ✓ "Account created successfully!"
- ✓ "Wallet saved for [email]"
- ✓ Wallet address appears in `data/wallets.json`
- ✓ Dashboard shows new entry with green "Active" badge
