/**
 * User Configuration File
 * Edit these settings to customize the bot behavior
 * 
 * Settings are loaded from .env file first, then overridden by values below
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config({ override: false });

const isRender = process.env.RENDER === 'true';
const defaultStorageRoot = isRender ? '/var/data/qorechain-bot' : process.cwd();
const defaultTransferWalletAddress = 'qor19f7e24eb12bb338d650265464a41e9e4fabab905';

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
}

export const USER_CONFIG = {
  /**
   * Browser Settings
   */
  browser: {
    // Render and other server runtimes should default to headless mode
    headless: parseBoolean(process.env.BROWSER_HEADLESS, isRender),
    
    // Browser window size [width, height]
    viewport: {
      width: parseInt(process.env.BROWSER_VIEWPORT_WIDTH || '1920'),
      height: parseInt(process.env.BROWSER_VIEWPORT_HEIGHT || '1080')
    },
    
    // Delay between actions in milliseconds (higher = slower but more reliable)
    slowMo: parseInt(process.env.BROWSER_SLOW_MO || (isRender ? '0' : '100'))
  },

  /**
   * Account Creation Settings
   */
  account: {
    // Email domains to use for random generation
    allowedDomains: (process.env.EMAIL_DOMAINS || 'gmail.com,yahoo.com,outlook.com,protonmail.com,icloud.com,mail.com')
      .split(',')
      .map(d => d.trim()),
    
    // Email prefix pattern (will be followed by random numbers)
    emailPrefix: process.env.ACCOUNT_EMAIL_PREFIX || 'qoreuser',
    
    // Password length (minimum 8, must include all character types)
    passwordLength: parseInt(process.env.ACCOUNT_PASSWORD_LENGTH || '12')
  },

  /**
   * Timing & Retry Settings
   */
  timing: {
    // Page load timeout in milliseconds
    pageTimeout: parseInt(process.env.TIMING_PAGE_TIMEOUT || '60000'),
    
    // Maximum retry attempts for failed operations
    maxRetries: parseInt(process.env.TIMING_MAX_RETRIES || '3'),
    
    // Delay between multi-account runs in milliseconds
    multiAccountDelay: parseInt(process.env.TIMING_MULTI_ACCOUNT_DELAY || '5000'),
    
    // Number of accounts to create in multi-account mode
    multiAccountCount: parseInt(process.env.TIMING_MULTI_ACCOUNT_COUNT || '3')
  },

  /**
   * Dashboard Settings
   */
  dashboard: {
    // Auto-refresh interval in milliseconds
    refreshInterval: parseInt(process.env.DASHBOARD_REFRESH_INTERVAL || '30000'),
    
    // Port for dashboard web server
    port: parseInt(process.env.DASHBOARD_PORT || '3000')
  },

  /**
   * URLs (Edit only if QoreChain changes their URLs)
   */
  urls: {
    dashboard: process.env.URL_DASHBOARD || 'https://dashboard.qorechain.io/',
    login: process.env.URL_LOGIN || 'https://auth.qorechain.io/login?response_type=code&client_id=2jfd4cromgb1skmd2cio68tf6d&redirect_uri=https%3A%2F%2Fdashboard.qorechain.io%2Fapi%2Fauth%2Fcallback&scope=openid+profile+email+aws.cognito.signin.user.admin&state=PtD9iqpR8XDkCQD1FnSM1w&code_challenge=5JCb09VD3WNfMSkWLosdTbKroWUR2BFE-z7-JOvJ6DM&code_challenge_method=S256',
    signup: process.env.URL_SIGNUP || 'https://auth.qorechain.io/signup?response_type=code&client_id=2jfd4cromgb1skmd2cio68tf6d&redirect_uri=https%3A%2F%2Fdashboard.qorechain.io%2Fapi%2Fauth%2Fcallback&scope=openid+profile+email+aws.cognito.signin.user.admin&state=PtD9iqpR8XDkCQD1FnSM1w&code_challenge=5JCb09VD3WNfMSkWLosdTbKroWUR2BFE-z7-JOvJ6DM&code_challenge_method=S256'
  },

  /**
   * Storage Settings
   */
  storage: {
    baseDir: process.env.STORAGE_BASE_DIR || defaultStorageRoot,
    walletsFile: process.env.STORAGE_WALLETS_FILE || 'data/wallets.json',
    screenshotsDir: process.env.STORAGE_SCREENSHOTS_DIR || 'screenshots'
  },

  /**
   * Token Transfer Settings
   */
  transfer: {
    // Wallet address to receive tokens (optional)
    walletAddress: process.env.TRANSFER_WALLET_ADDRESS || defaultTransferWalletAddress
  }
};

// Export individual settings for easy importing
export const { browser, account, timing, dashboard, urls, storage, transfer } = USER_CONFIG;
