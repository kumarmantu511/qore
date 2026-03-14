# 🏗️ QoreChain Auto Bot - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  start.bat   │  │dashboard.bat │  │  npm scripts │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Main Bot (bot.ts)                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  - Browser Control (Playwright)               │  │    │
│  │  │  - Navigation & Form Filling                  │  │    │
│  │  │  - Error Handling & Retry Logic               │  │    │
│  │  │  - Screenshot Capture                         │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │ Email          │  │ Password       │                    │
│  │ Generator      │  │ Generator      │                    │
│  │                │  │                │                    │
│  │ - Random email │  │ - Secure pwd   │                    │
│  │ - Domain pool  │  │ - Validation   │                    │
│  │ - Validation   │  │ - Requirements │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │ Storage        │  │ Config         │                    │
│  │ Module         │  │ Module         │                    │
│  │                │  │                │                    │
│  │ - JSON file    │  │ - Settings     │                    │
│  │ - CRUD ops     │  │ - Constants    │                    │
│  │ - Persistence  │  │ - URLs         │                    │
│  └────────────────┘  └────────────────┘                    │
│                                                              │
│  ┌────────────────────────────────┐                         │
│  │ Multi-Account Runner           │                         │
│  │                                │                         │
│  │ - Sequential execution         │                         │
│  │ - Progress tracking            │                         │
│  │ - Statistics                   │                         │
│  └────────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           data/wallets.json                           │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ [                                               │  │  │
│  │  │   {                                             │  │  │
│  │  │     "id": "...",                               │  │  │
│  │  │     "email": "...",                            │  │  │
│  │  │     "password": "...",                         │  │  │
│  │  │     "walletAddress": "0x...",                  │  │  │
│  │  │     "createdAt": "...",                        │  │  │
│  │  │     "status": "active"                         │  │  │
│  │  │   }                                             │  │  │
│  │  │ ]                                               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           screenshots/                                │  │
│  │  - Error screenshots for debugging                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Presentation Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         dashboard/index.html                          │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Web Dashboard (Tailwind CSS + Vanilla JS)     │  │  │
│  │  │                                                 │  │  │
│  │  │  - Real-time wallet display                    │  │  │
│  │  │  - Statistics cards                            │  │  │
│  │  │  - Copy-to-clipboard                           │  │  │
│  │  │  - Auto-refresh (30s)                          │  │  │
│  │  │  - Status indicators                           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                External Services                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  QoreChain Signup Page                                │  │
│  │  https://auth.qorechain.io/signup                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Playwright Chromium Browser                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Single Account Creation Flow

```
START
  │
  ├─► Generate Email ──► qoreuser4729@gmail.com
  │
  ├─► Generate Password ──► Xy9#aB2kL5mN
  │
  ├─► Launch Browser (Playwright)
  │
  ├─► Navigate to Signup URL
  │
  ├─► Fill Email Field
  │
  ├─► Fill Password Field
  │
  ├─► Click Sign Up Button
  │
  ├─► Wait for Terms Page
  │
  ├─► Scroll Through Terms
  │
  ├─► Click Accept Button
  │
  ├─► Wait for Dashboard/Wallet Page
  │
  ├─► Extract Wallet Address ──► 0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F
  │
  ├─► Create Wallet Entry Object
  │     {
  │       id, email, password,
  │       walletAddress, createdAt, status
  │     }
  │
  ├─► Save to data/wallets.json
  │
  ├─► Log Success Message
  │
  └─► Close Browser
        │
        ▼
      END
```

### Multi-Account Flow

```
START
  │
  ├─► Read Configuration
  │     count: 5
  │     delayBetweenRuns: 5000ms
  │
  ├─► Initialize Counters
  │     success: 0, failed: 0, total: 0
  │
  ├─► FOR i = 1 TO count
  │     │
  │     ├─► Create Bot Instance
  │     │
  │     ├─► Run Single Account Flow
  │     │
  │     ├─► IF success
  │     │   └─► success++
  │     │   ELSE
  │     │   └─► failed++
  │     │
  │     ├─► total++
  │     │
  │     ├─► Display Progress
  │     │
  │     ├─► IF i < count
  │     │   └─► Wait delayBetweenRuns ms
  │     │
  │     └─► Continue to next iteration
  │
  ├─► Display Final Summary
  │     Success Rate: (success/total)*100%
  │
  ├─► Load All Wallets from Storage
  │
  └─► Display Total Count
        │
        ▼
      END
```

### Dashboard Data Flow

```
User Opens Dashboard (index.html)
  │
  ├─► Load wallets.json via Fetch API
  │
  ├─► Parse JSON Data
  │
  ├─► Calculate Statistics
  │     total, active, errors
  │
  ├─► Update Stats Cards
  │
  ├─► Render Table Rows
  │     For each wallet:
  │     - Format email
  │     - Mask password
  │     - Truncate wallet address
  │     - Add status badge
  │     - Add action buttons
  │
  ├─► Display Table
  │
  ├─► Set Interval Timer (30s)
  │
  └─► LOOP: Auto-refresh
        │
        ├─► Re-fetch wallets.json
        ├─► Re-render table
        └─► Update timestamp
```

---

## Component Interaction Map

```
┌─────────────────┐
│  bot.ts         │◄────────────────────────┐
│  (Main Orchestrator)                      │
└────┬────────────┘                         │
     │                                      │
     ├─► imports ──► email-generator.ts     │
     │                                      │
     ├─► imports ──► password-generator.ts  │
     │                                      │
     ├─► imports ──► storage.ts ────────────┼──► reads/writes ──► wallets.json
     │                                      │
     ├─► uses ──► config.ts                │
     │                                      │
     └─► controls ──► Playwright Browser    │
                                            │
┌─────────────────┐                         │
│  dashboard/     │◄────────────────────────┘
│  index.html     │
└─────────────────┘
     │
     └─► reads ──► wallets.json (via HTTP fetch)


┌─────────────────────────┐
│  multi-account-runner.ts│
└────┬────────────────────┘
     │
     ├─► imports ──► bot.ts (multiple instances)
     │
     └─► imports ──► storage.ts (for final stats)
```

---

## File Dependencies

```
package.json
    │
    └─► Dependencies:
        ├─► playwright (browser automation)
        ├─► typescript (type safety)
        ├─► ts-node (TypeScript execution)
        └─► @types/node (Node.js types)

tsconfig.json
    │
    └─► Compiler settings:
        ├─► Target: ES2020
        ├─► Module: commonjs
        └─► Output: dist/

src/bot.ts
    ├─► imports: email-generator.ts
    ├─► imports: password-generator.ts
    ├─► imports: storage.ts
    └─► exports: QoreChainBot class

src/storage.ts
    ├─► Node.js fs module
    ├─► Node.js path module
    └─► exports: CRUD functions

src/config.ts
    └─► exports: USER_CONFIG object

dashboard/index.html
    ├─► Tailwind CSS (CDN)
    └─► Vanilla JavaScript (inline)
```

---

## State Management

### Application States

```
IDLE
  │
  ├─► User triggers bot
  │
  ▼
RUNNING
  │
  ├─► Browser launching
  │
  ▼
NAVIGATING
  │
  ├─► Loading signup page
  │
  ▼
FILLING_FORM
  │
  ├─► Entering credentials
  │
  ▼
SUBMITTING
  │
  ├─► Waiting for response
  │
  ▼
ACCEPTING_TERMS
  │
  ├─► Processing ToS
  │
  ▼
EXTRACTING_WALLET
  │
  ├─► Reading address
  │
  ▼
SAVING_DATA
  │
  ├─► Writing to JSON
  │
  ▼
COMPLETED (Success or Error)
  │
  └─► Returns to IDLE
```

### Data States

```
Wallet Entry Lifecycle:

PENDING (initial state)
  │
  ├─► Account creation in progress
  │
  ▼
ACTIVE (successful creation)
  │
  └─► Wallet address extracted and saved
  
  OR
  
ERROR (creation failed)
  │
  └─► Error message stored
```

---

## Error Handling Strategy

```
Try Block
  │
  ├─► Operation attempted
  │
  ▼
Success?
  │
  ├─► YES ──► Continue to next step
  │
  └─► NO ──► Catch Block
              │
              ├─► Log error message
              │
              ├─► Take screenshot
              │
              ├─► Update wallet status to 'error'
              │
              ├─► Save error to JSON
              │
              └─► Retry? (if maxRetries not exceeded)
                  │
                  ├─► YES ──► Retry operation
                  │
                  └─► NO ──► Move to next step
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│  Security Layers                        │
├─────────────────────────────────────────┤
│                                          │
│  1. Local Storage Only                  │
│     - No cloud APIs                      │
│     - No external data transmission      │
│                                          │
│  2. File System Permissions             │
│     - Read/write only in project dir    │
│     - No system-level access            │
│                                          │
│  3. Browser Isolation                   │
│     - Fresh browser context each time   │
│     - No persistent cookies             │
│     - Clean session on close            │
│                                          │
│  4. Credential Protection               │
│     - Passwords generated locally       │
│     - Stored in local JSON only         │
│     - No logging of full passwords      │
│                                          │
└─────────────────────────────────────────┘
```

---

## Performance Characteristics

### Resource Usage

```
Memory:
  ├─► Node.js runtime: ~50MB
  ├─► Browser instance: ~150-300MB
  ├─► TypeScript compilation: ~20MB
  └─► Total: ~220-370MB per run

CPU:
  ├─► Idle: <5%
  ├─► Browser automation: 10-30%
  └─► Compilation: 20-50% (brief spikes)

Disk:
  ├─► Source code: ~50KB
  ├─► Compiled JS: ~100KB
  ├─► Each wallet entry: ~500 bytes
  └─► Each screenshot: ~200KB

Network:
  ├─► Initial page load: ~2-5MB
  ├─► Form submission: ~50KB
  └─► Terms page: ~500KB
```

### Timing Breakdown

```
Per Account (single run):
  ├─► Browser launch: 2-3s
  ├─► Page navigation: 3-5s
  ├─► Form filling: 1-2s
  ├─► Form submission: 3-5s
  ├─► Terms acceptance: 2-4s
  ├─► Wallet extraction: 2-3s
  └─► Total: 15-25s

Per Account (multi-run with delays):
  ├─► Account creation: 15-25s
  ├─► Delay between runs: 5-10s (configurable)
  └─► Total per account: 20-35s
```

---

## Scalability Model

### Horizontal Scaling (Sequential)

```
Multi-Account Runner:
  Account 1 ──► wait ──► Account 2 ──► wait ──► Account 3 ...
  
Pros:
  ✓ Simple implementation
  ✓ Low resource usage
  ✓ Easy to monitor
  ✓ Safe rate limiting

Cons:
  ✗ Slower than parallel
  ✗ Linear time increase
```

### Vertical Scaling (Parallel - Future Enhancement)

```
Theoretical Parallel Runner:
  Account 1 ─┐
  Account 2 ─┼──► Simultaneous execution
  Account 3 ─┘
  
Pros:
  ✓ Faster execution
  ✓ Better throughput

Cons:
  ✗ Higher resource usage
  ✗ More complex error handling
  ✗ Potential rate limiting issues
```

---

## Monitoring & Observability

```
Console Output:
  ├─► Emoji-prefixed messages
  ├─► Timestamp information
  ├─► Progress indicators
  └─► Clear success/error states

Screenshots:
  ├─► Automatic on errors
  ├─► Timestamped filenames
  └─► Visual debugging aid

JSON Logs:
  ├─► Wallet entries with status
  ├─► Error messages stored
  └─► Timestamps for all entries

Dashboard:
  ├─► Real-time statistics
  ├─✓ Active vs Error counts
  └─✓ Last updated timestamp
```

---

This architecture provides:
- ✅ **Modularity**: Clear separation of concerns
- ✅ **Maintainability**: Easy to understand and modify
- ✅ **Reliability**: Robust error handling
- ✅ **Scalability**: Can run multiple accounts
- ✅ **Observability**: Clear monitoring and debugging
- ✅ **Security**: Local-only storage, no external dependencies
