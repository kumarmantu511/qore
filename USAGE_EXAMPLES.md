# 🚀 QoreChain Auto Bot - Usage Examples

## Quick Commands Reference

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Run bot once (TypeScript mode) | Testing single account |
| `npm run build` | Compile TypeScript | Before production run |
| `npm start` | Run compiled bot | Production use |
| `npm run multi` | Run multiple accounts | Batch creation |
| `npm run dashboard` | Open web dashboard | View/manage wallets |
| `start.bat` | Windows quick-start | Easy launching |
| `dashboard.bat` | Windows dashboard launcher | Easy dashboard access |

---

## 📋 Step-by-Step Examples

### Example 1: First Time Setup

```bash
# Navigate to project
cd c:\Users\vazva\Desktop\qorechain\qorechain-bot

# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Verify installation (should show empty array)
cat data/wallets.json
```

**Expected Output:**
```
[]
✓ All dependencies installed
✓ Chromium browser ready
```

---

### Example 2: Create Your First Account

**Method A: Using npm script (Recommended)**
```bash
npm run dev
```

**Method B: Using Windows batch file**
```bash
double-click start.bat
```

**What You'll See:**
```
============================================================
🤖 Starting QoreChain Bot
============================================================
📧 Email: qoreuser7392@gmail.com
🔑 Password: Kx8#mNp2Qr5T
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
✓ Wallet address found: 0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F
✅ Account created successfully!
✓ Wallet saved for qoreuser7392@gmail.com

⏱️ Completed in 24.73s
🔒 Closing browser...
✓ Browser closed

✨ Bot execution complete!
```

**Check Results:**
```bash
# View wallets.json
cat data/wallets.json
```

**Output:**
```json
[
  {
    "id": "abc123xyz",
    "email": "qoreuser7392@gmail.com",
    "password": "Kx8#mNp2Qr5T",
    "walletAddress": "0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F",
    "createdAt": "2026-03-13T10:30:45.123Z",
    "status": "active"
  }
]
```

---

### Example 3: Open Dashboard to View Wallets

**Method A: Using npm**
```bash
npm run dashboard
```

**Method B: Using Windows batch file**
```bash
double-click dashboard.bat
```

**Method C: Direct file access**
```
Simply open: c:\Users\vazva\Desktop\qorechain\qorechain-bot\dashboard\index.html
```

**Dashboard Shows:**
- Total Wallets: 1
- Active: 1
- Errors: 0
- Table with your wallet details
- Copy buttons for addresses

---

### Example 4: Create Multiple Accounts

**Step 1: Configure count**
Edit `src/multi-account-runner.ts`:

```typescript
const CONFIG: RunConfig = {
  count: 5,              // Create 5 accounts
  delayBetweenRuns: 5000 // 5 seconds between each
};
```

**Step 2: Run multi-account script**
```bash
npm run multi
```

**Expected Output:**
```
============================================================
🚀 Starting Multi-Account Runner
============================================================
📊 Total accounts to create: 5
⏱️ Delay between runs: 5s
============================================================

============================================================
🎯 Creating Account 1/5
============================================================
[... account creation process ...]
✅ Account 1 created successfully!

⏳ Waiting 5 seconds before next account...

============================================================
🎯 Creating Account 2/5
============================================================
[... account creation process ...]
✅ Account 2 created successfully!

⏳ Waiting 5 seconds before next account...

[... continues for all 5 accounts ...]

============================================================
📊 FINAL SUMMARY
============================================================
✅ Successful: 5
❌ Failed: 0
📈 Success Rate: 100.00%
============================================================

💾 Total wallets in storage: 5

✨ Multi-account runner completed!
```

---

### Example 5: Check All Created Wallets

**View in Terminal:**
```bash
node -e "console.log(JSON.stringify(require('./data/wallets.json'), null, 2))"
```

**Sample Output:**
```json
[
  {
    "id": "abc123",
    "email": "qoreuser7392@gmail.com",
    "password": "Kx8#mNp2Qr5T",
    "walletAddress": "0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F",
    "createdAt": "2026-03-13T10:30:45.123Z",
    "status": "active"
  },
  {
    "id": "def456",
    "email": "qoreuser1847@yahoo.com",
    "password": "Zy7$pLm3Nx9W",
    "walletAddress": "0x2a5Bc8d9E1f3A7b6C4d2E8f9A0b1C3d5E7f8A9b0",
    "createdAt": "2026-03-13T10:31:12.456Z",
    "status": "active"
  },
  {
    "id": "ghi789",
    "email": "qoreuser5621@outlook.com",
    "password": "Mn4@kRt8Pq2S",
    "walletAddress": "0x9c8Df7e6A5b4C3d2E1f0A9b8C7d6E5f4A3b2C1d0",
    "createdAt": "2026-03-13T10:31:38.789Z",
    "status": "active"
  }
]
```

---

### Example 6: Customize Settings

**Change email domain preference:**
Edit `src/config.ts`:

```typescript
account: {
  allowedDomains: [
    'gmail.com',      // Primary choice
    'protonmail.com', // More private alternative
    'icloud.com'
  ],
  emailPrefix: 'testuser', // Change prefix
  passwordLength: 15       // Longer passwords
}
```

**Run in background (invisible):**
```typescript
browser: {
  headless: true,     // No visible window
  slowMo: 50          // Faster execution
}
```

**Increase reliability:**
```typescript
timing: {
  pageTimeout: 90000,        // 90 second timeout
  maxRetries: 5,             // 5 retry attempts
  multiAccountDelay: 10000   // 10 seconds between accounts
}
```

---

### Example 7: Production Deployment

**Step 1: Build compiled version**
```bash
npm run build
```

**Step 2: Configure for production**
Edit `src/config.ts`:
```typescript
browser: {
  headless: true,     // Invisible
  slowMo: 50          // Fast
}
```

**Step 3: Run in background**
```bash
npm start
```

Or create a scheduled task/script to run automatically.

---

## 🔍 Monitoring & Debugging

### Monitor Live Progress

While bot is running, watch console for:
- ✅ Success indicators (green checkmarks)
- ⚠️ Warnings (yellow exclamation)
- ❌ Errors (red X marks)

### Check Screenshots on Errors

If something fails, check:
```bash
ls screenshots/
# You'll see files like: bot_error_2026-03-13T10-30-45.png
```

Open these PNG files to see exactly what happened.

### View Logs

All activity is logged to console with timestamps and emojis for easy reading.

---

## 📊 Real-World Usage Scenarios

### Scenario 1: Test 10 Accounts for QA

```bash
# Edit multi-account-runner.ts: count=10
npm run multi
# Watch as 10 accounts are created sequentially
# Open dashboard to verify all wallets
```

### Scenario 2: Daily Account Creation

Create a scheduled task (Windows Task Scheduler):
```batch
@echo off
cd c:\Users\vazva\Desktop\qorechain\qorechain-bot
npm start
```

Schedule to run daily at specific time.

### Scenario 3: Monitor Dashboard While Bot Runs

Terminal 1 (run bot):
```bash
npm run dev
```

Terminal 2 (open dashboard):
```bash
npm run dashboard
```

Watch real-time updates as accounts are created!

---

## ⚡ Power User Tips

1. **Speed Up Execution**
   ```typescript
   // In config.ts
   slowMo: 50           // Faster actions
   headless: true       // No UI overhead
   ```

2. **Improve Reliability**
   ```typescript
   // In config.ts
   maxRetries: 5        // More attempts
   pageTimeout: 120000  // Longer timeout
   ```

3. **Custom Email Patterns**
   ```typescript
   // In email-generator.ts, modify:
   return `customprefix${randomNum}@${domain}`;
   ```

4. **Export Wallets to CSV**
   ```javascript
   // Create export-wallets.js
   const wallets = require('./data/wallets.json');
   const csv = wallets.map(w => 
     `${w.email},${w.password},${w.walletAddress}`
   ).join('\n');
   require('fs').writeFileSync('wallets.csv', csv);
   ```

5. **Backup Wallets Automatically**
   ```bash
   # Create backup script
   copy data\wallets.json data\wallets_backup_%date%.json
   ```

---

## 🎯 Expected Timeline

**Single Account Creation:**
- Browser launch: ~2 seconds
- Page navigation: ~3-5 seconds
- Form filling: ~2 seconds
- Form submission: ~3-5 seconds
- Terms acceptance: ~2-4 seconds
- Wallet extraction: ~2-3 seconds
- **Total: ~15-25 seconds per account**

**Multi-Account (5 accounts):**
- With 5-second delays: ~2-3 minutes total
- With 10-second delays: ~3-4 minutes total

---

## ✅ Verification Checklist

After running the bot, verify:

- [ ] Browser opened and closed properly
- [ ] Console shows "✅ Account created successfully!"
- [ ] `data/wallets.json` has new entry
- [ ] Dashboard shows new wallet
- [ ] Wallet address is valid (0x... format)
- [ ] Status is "active" (green badge)
- [ ] Email and password are saved

If all checks pass, everything worked perfectly! 🎉

---

## 🆘 When Things Go Wrong

### Issue: Account created but no wallet address

**Solution:**
- Check screenshot in `screenshots/` folder
- Manually verify account exists
- Update wallet entry manually if needed

### Issue: Form submission timeout

**Solution:**
```typescript
// Increase timeout in config.ts
timing: {
  pageTimeout: 120000  // 2 minutes
}
```

### Issue: Multiple failures

**Solution:**
1. Test signup manually in browser
2. Verify URL is accessible
3. Check internet connection
4. Review all screenshots
5. Adjust delays and timeouts

---

## 🎉 Success!

You now have a fully automated QoreChain account creation system with:
- ✅ One-click operation
- ✅ Beautiful dashboard
- ✅ Complete error handling
- ✅ Scalable multi-account support
- ✅ Professional monitoring tools

Happy automating! 🚀
