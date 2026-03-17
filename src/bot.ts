/**
 * Main bot automation logic for QoreChain account creation.
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { generateRandomEmail, isValidEmail } from './email-generator';
import { generatePassword, validatePassword } from './password-generator';
import { saveWallet, WalletEntry } from './storage';
import { browser, timing, storage, transfer } from './config';

const CONFIG = {
  headless: browser.headless,
  slowMo: Math.min(browser.slowMo, 10),
  timeout: timing.pageTimeout,
  signinUrl: 'https://dashboard.qorechain.io/auth/signin',
  authHost: 'https://auth.qorechain.io',
  dashboardUrl: 'https://dashboard.qorechain.io/',
  walletUrl: 'https://dashboard.qorechain.io/wallet',
  faucetUrl: 'https://dashboard.qorechain.io/faucet',
  termsUrl: 'https://dashboard.qorechain.io/terms/accept?redirect=%2Fwallet',
  transferAddress: transfer.walletAddress,
  transferAmount: '999.990000'
};

const STEP_DELAY = 80;
const SHORT_WAIT = 250;
const MEDIUM_WAIT = 700;
const LONG_WAIT = 1800;

const WALLET_NAME_PREFIXES = [
  'Atlas',
  'Nova',
  'Aurora',
  'Luna',
  'Orion',
  'Zenith',
  'Sierra',
  'Echo',
  'Nimbus',
  'Vega',
  'Mira',
  'River'
];

const WALLET_NAME_SUFFIXES = [
  'Vault',
  'Core',
  'Nest',
  'Point',
  'Flow',
  'Base',
  'Key',
  'Pulse',
  'Orbit',
  'Bridge'
];

let shutdownRequested = false;
let signalHandlersInstalled = false;

function installShutdownSignalHandlers(): void {
  if (signalHandlersInstalled) {
    return;
  }

  signalHandlersInstalled = true;

  const requestShutdown = () => {
    shutdownRequested = true;
  };

  process.on('SIGTERM', requestShutdown);
  process.on('SIGINT', requestShutdown);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function generateWalletLabel(): string {
  const prefix = WALLET_NAME_PREFIXES[Math.floor(Math.random() * WALLET_NAME_PREFIXES.length)];
  const suffix = WALLET_NAME_SUFFIXES[Math.floor(Math.random() * WALLET_NAME_SUFFIXES.length)];
  const code = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix} ${suffix} ${code}`;
}

class QoreChainBot {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private logFile: string | null = null;
  private transferCompleted = false;
  private lastHttpError: string | null = null;
  private lastWalletLabel = '';

  private ensureDirectory(dirPath: string): string {
    const resolved = path.isAbsolute(dirPath) ? dirPath : path.resolve(process.cwd(), dirPath);
    if (!fs.existsSync(resolved)) {
      fs.mkdirSync(resolved, { recursive: true });
    }
    return resolved;
  }

  private initializeLogFile(): void {
    const logsDir = this.ensureDirectory('logs');
    const logName = `bot_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    this.logFile = path.join(logsDir, logName);
    fs.writeFileSync(this.logFile, '', 'utf8');
  }

  private log(message: string): void {
    const line = `[${new Date().toISOString()}] ${message}`;
    console.log(line);
    if (this.logFile) {
      fs.appendFileSync(this.logFile, `${line}\n`, 'utf8');
    }
  }

  private async logPageState(label: string): Promise<void> {
    if (!this.page) {
      this.log(`[state] ${label} | page unavailable`);
      return;
    }

    try {
      const url = this.page.url();
      const title = await this.page.title().catch(() => 'unknown');
      this.log(`[state] ${label} | url=${url} | title=${title}`);
    } catch (error: any) {
      this.log(`[state] ${label} | failed to read page state: ${error.message}`);
    }
  }

  private async clickButtonByExactText(text: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const locator = this.page.locator('button').filter({ hasText: new RegExp(`^${text}$`) }).first();
    this.log(`[click] looking for button text="${text}"`);

    if (await locator.count() > 0) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        const box = await locator.boundingBox();
        this.log(`[click] found locator for "${text}"${box ? ` at x=${box.x},y=${box.y},w=${box.width},h=${box.height}` : ''}`);
        await locator.scrollIntoViewIfNeeded();
        await locator.click({ force: true, delay: 30 });
        this.log(`[click] Playwright click succeeded for "${text}"`);
        return true;
      } catch (error: any) {
        this.log(`[click] Playwright click failed for "${text}": ${error.message}`);
        try {
          const box = await locator.boundingBox();
          if (box) {
            await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
            this.log(`[click] Mouse coordinate click succeeded for "${text}"`);
            return true;
          }
        } catch (mouseError: any) {
          this.log(`[click] Mouse coordinate click failed for "${text}": ${mouseError.message}`);
        }
      }
    }

    const domClicked = await this.page.evaluate((targetText) => {
      const runtime = globalThis as Record<string, any>;
      const buttons = Array.from(runtime.document?.querySelectorAll('button') || []);
      const target = buttons.find((button: any) => button.textContent?.trim() === targetText) as any;
      if (!target) {
        return false;
      }

      target.scrollIntoView?.({ block: 'center' });
      target.click?.();
      return true;
    }, text);

    this.log(`[click] DOM click fallback for "${text}" result=${domClicked}`);
    return domClicked;
  }

  private async clickSigninCardButton(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    this.log('[click] trying exact signin card button selector');

    const directLocator = this.page.locator(
      'button[type="button"].w-full.py-4.px-6.rounded-xl.text-base.font-semibold.cursor-pointer'
    ).first();

    if (await directLocator.count() > 0) {
      try {
        await directLocator.waitFor({ state: 'visible', timeout: 5000 });
        const text = ((await directLocator.textContent()) || '').trim();
        this.log(`[click] signin card locator text=${JSON.stringify(text)}`);
        await directLocator.scrollIntoViewIfNeeded();
        await directLocator.click({ force: true, delay: 20 });
        this.log('[click] exact signin card locator click succeeded');
        return true;
      } catch (error: any) {
        this.log(`[click] exact signin card locator click failed: ${error.message}`);
      }
    }

    const domClicked = await this.page.evaluate(() => {
      const runtime = globalThis as Record<string, any>;
      const normalize = (value: string | null | undefined) =>
        (value || '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLocaleLowerCase('tr-TR');

      const buttons = Array.from(
        runtime.document?.querySelectorAll(
          'button[type="button"].w-full.py-4.px-6.rounded-xl.text-base.font-semibold.cursor-pointer'
        ) || []
      );

      const target = buttons.find((button: any) => {
        const text = normalize(button.textContent);
        return text === 'giriş yap' || text === 'giris yap';
      }) as any;

      if (!target) {
        return false;
      }

      target.scrollIntoView?.({ block: 'center' });
      target.click?.();
      return true;
    });

    this.log(`[click] exact signin card DOM fallback result=${domClicked}`);
    return domClicked;
  }

  private async fillFirst(selectors: string[], value: string, label: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    for (const selector of selectors) {
      const locator = this.page.locator(selector).first();
      if (await locator.count() === 0) {
        continue;
      }

      try {
        await locator.waitFor({ state: 'visible', timeout: 4000 });
        await locator.fill(value);
        this.log(`[form] filled ${label} using selector ${selector}`);
        return;
      } catch (error: any) {
        this.log(`[form] failed ${label} with selector ${selector}: ${error.message}`);
      }
    }

    throw new Error(`Could not fill ${label} with selectors: ${selectors.join(', ')}`);
  }

  private async getDynamicSignupUrl(): Promise<string | null> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    try {
      await this.page.waitForSelector('a[href*="/signup?"]', {
        state: 'attached',
        timeout: 8000
      });

      const signupLinks = await this.page.evaluate(() => {
        const runtime = globalThis as Record<string, any>;
        const links = Array.from(
          runtime.document?.querySelectorAll('a[href*="/signup?"]') || []
        ).map((link: any) => {
          const rect = link.getBoundingClientRect?.() || { width: 0, height: 0 };
          return {
            text: (link.textContent || '').trim(),
            href: link.getAttribute?.('href') ?? null,
            visible: rect.width > 0 && rect.height > 0
          };
        });

        return links;
      });

      this.log(`[signup] discovered signup links=${JSON.stringify(signupLinks)}`);

      const chosenLink = signupLinks.find(
        (link: any) => link.text === 'Sign up' && typeof link.href === 'string' && link.href.includes('client_id=')
      ) || signupLinks.find((link: any) => typeof link.href === 'string' && link.href.includes('client_id='));

      const href = chosenLink?.href ?? null;
      const resolved = !href ? null : href.startsWith('http') ? href : `${CONFIG.authHost}${href}`;
      this.log(`[signup] dynamic signup url=${resolved ?? 'not-found'}`);
      return resolved;
    } catch (error: any) {
      this.log(`[signup] failed to get dynamic signup url: ${error.message}`);
      return null;
    }
  }

  private buildAuthRouteFromCurrentUrl(route: 'login' | 'signup'): string | null {
    if (!this.page) {
      return null;
    }

    try {
      const currentUrl = new URL(this.page.url());
      if (!currentUrl.search) {
        return null;
      }

      return `${CONFIG.authHost}/${route}${currentUrl.search}`;
    } catch {
      return null;
    }
  }

  private async recoverFromAuthorize403(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const currentUrl = this.page.url();
    const title = await this.page.title().catch(() => '');
    const isAuthorize403 =
      currentUrl.includes('/oauth2/authorize') ||
      /403/i.test(title);

    if (!isAuthorize403) {
      return;
    }

    const loginUrl = this.buildAuthRouteFromCurrentUrl('login');
    if (!loginUrl) {
      this.log('[auth] authorize fallback skipped because login URL could not be constructed');
      return;
    }

    this.log(`[auth] detected authorize/403 page, falling back to ${loginUrl}`);
    await this.page.goto(loginUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout
    });
    await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
    await sleep(SHORT_WAIT);
    await this.logPageState('after-authorize-fallback');
  }

  private async hasSignupForm(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const emailCount = await this.page.locator('input[name="username"], input[type="email"]').count();
    const passwordCount = await this.page.locator('input[name="password"], input[type="password"]').count();
    const submitCount = await this.page.locator('button[name="signUpButton"], button:has-text("Sign up")').count();
    const result = emailCount > 0 && passwordCount > 0 && submitCount > 0;
    this.log(`[signup] form presence: email=${emailCount}, password=${passwordCount}, submit=${submitCount}, ready=${result}`);
    return result;
  }

  private async clickFirstMatchingButton(patterns: RegExp[], label: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const buttons = this.page.locator('button');
    const count = await buttons.count();
    this.log(`[click] scanning ${count} buttons for ${label}`);

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = ((await button.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!patterns.some((pattern) => pattern.test(text))) {
        continue;
      }

      try {
        await button.scrollIntoViewIfNeeded().catch(() => undefined);
        await button.click({ force: true, delay: 20 });
        this.log(`[click] clicked ${label} with text=${JSON.stringify(text)}`);
        return true;
      } catch (error: any) {
        this.log(`[click] failed clicking ${label} text=${JSON.stringify(text)}: ${error.message}`);
      }
    }

    return false;
  }

  private async clickTermsAcceptButton(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const buttons = this.page.locator('button');
    const count = await buttons.count();
    this.log(`[terms] scanning ${count} buttons for terms accept`);

    const allowPatterns = [
      /^Kabul Ediyorum$/i,
      /^I Agree$/i,
      /^I Accept$/i,
      /^Accept Terms$/i,
      /^Continue$/i
    ];
    const rejectPatterns = [
      /Accept All/i,
      /Reject/i,
      /Cookie/i,
      /Manage Preferences/i
    ];

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = ((await button.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!text) {
        continue;
      }
      if (rejectPatterns.some((pattern) => pattern.test(text))) {
        continue;
      }
      if (!allowPatterns.some((pattern) => pattern.test(text))) {
        continue;
      }

      try {
        await button.scrollIntoViewIfNeeded().catch(() => undefined);
        await button.evaluate((element) => {
          (element as any).disabled = false;
        }).catch(() => undefined);
        await button.click({ force: true, delay: 30 });
        this.log(`[terms] clicked exact accept button text=${JSON.stringify(text)}`);
        return true;
      } catch (error: any) {
        this.log(`[terms] failed clicking exact accept button text=${JSON.stringify(text)}: ${error.message}`);
      }
    }

    return false;
  }

  private async dismissCookieBanner(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const cookieClicked = await this.clickFirstMatchingButton(
      [/^Decline$/i, /^Reject$/i, /^Close$/i, /^Dismiss$/i],
      'cookie-dismiss'
    );

    if (cookieClicked) {
      this.log('[cookie] dismissed cookie banner');
      await sleep(SHORT_WAIT);
    }
  }

  private async clickFirstMatchingInput(patterns: RegExp[], label: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const inputs = this.page.locator('input[type="submit"], input[type="button"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const value = ((await input.getAttribute('value').catch(() => '')) || '').trim();
      if (!patterns.some((pattern) => pattern.test(value))) {
        continue;
      }

      try {
        await input.click({ force: true, delay: 20 });
        this.log(`[click] clicked ${label} input value=${JSON.stringify(value)}`);
        return true;
      } catch (error: any) {
        this.log(`[click] failed clicking ${label} input value=${JSON.stringify(value)}: ${error.message}`);
      }
    }

    return false;
  }

  private async fillAmountInput(value: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const amountInput = this.page.locator('input[type="number"]').first();
    if (await amountInput.count() === 0) {
      this.log('[send] amount input not found');
      return false;
    }

    try {
      await amountInput.waitFor({ state: 'visible', timeout: 4000 });
      await amountInput.fill('');
      await amountInput.type(value, { delay: 20 });
      await amountInput.evaluate((element, amountValue) => {
        const input = element as any;
        input.value = amountValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
      const currentValue = await amountInput.inputValue().catch(() => '');
      this.log(`[send] amount input set to ${JSON.stringify(currentValue)}`);
      return currentValue === value;
    } catch (error: any) {
      this.log(`[send] failed to fill amount input: ${error.message}`);
      return false;
    }
  }

  private async getVisibleText(patterns: RegExp[], selector = 'body'): Promise<string | null> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const locator = this.page.locator(selector);
    const text = ((await locator.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[0]) {
        return match[0];
      }
    }

    return null;
  }

  private async waitForTransferOutcome(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    const successPatterns = [
      /success/i,
      /successful/i,
      /submitted/i,
      /completed/i,
      /sent/i,
      /gonderildi/i,
      /basarili/i,
      /ba.ar.l./i
    ];
    const failurePatterns = [
      /failed/i,
      /error/i,
      /invalid/i,
      /insufficient/i,
      /rejected/i,
      /denied/i,
      /unsuccessful/i
    ];

    for (let attempt = 0; attempt < 8; attempt++) {
      await sleep(500);

      if (this.lastHttpError) {
        this.log(`[send] detected HTTP error after confirm=${this.lastHttpError}`);
        return false;
      }

      const bodyText = ((await this.page.locator('body').textContent().catch(() => '')) || '')
        .replace(/\s+/g, ' ')
        .trim();

      if (successPatterns.some((pattern) => pattern.test(bodyText))) {
        this.log('[send] transfer success indicator detected in page text');
        return true;
      }

      if (failurePatterns.some((pattern) => pattern.test(bodyText))) {
        this.log('[send] transfer failure indicator detected in page text');
        return false;
      }
    }

    const confirmButtonStillVisible = await this.page
      .locator('button')
      .filter({ hasText: /Confirm|Onayla/i })
      .first()
      .isVisible()
      .catch(() => false);
    this.log(`[send] confirm button still visible after wait=${confirmButtonStillVisible}`);
    return !confirmButtonStillVisible;
  }

  private async waitForManualClose(): Promise<void> {
    if (!this.browser) {
      return;
    }

    this.log('[bot] Browser will stay open until you close it manually.');

    await new Promise<void>((resolve) => {
      if (!this.browser) {
        resolve();
        return;
      }

      if (!this.browser.isConnected()) {
        resolve();
        return;
      }

      this.browser.once('disconnected', () => {
        this.log('[bot] Browser was closed manually.');
        resolve();
      });
    });

    this.browser = null;
    this.page = null;
  }

  async launchBrowser(): Promise<void> {
    installShutdownSignalHandlers();
    this.initializeLogFile();
    this.log(`[bot] Launching browser | headless=${CONFIG.headless} | slowMo=${CONFIG.slowMo}`);

    this.browser = await chromium.launch({
      headless: CONFIG.headless,
      slowMo: CONFIG.slowMo,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-application-cache'
      ]
    });

    const context = await this.browser.newContext({
      viewport: browser.viewport,
      ignoreHTTPSErrors: true
    });

    this.page = await context.newPage();
    this.page.setDefaultTimeout(CONFIG.timeout);

    this.page.on('console', (msg) => this.log(`[page-console] ${msg.type()}: ${msg.text()}`));
    this.page.on('pageerror', (error) => this.log(`[page-error] ${error.message}`));
    this.page.on('requestfailed', (request) =>
      this.log(`[request-failed] ${request.method()} ${request.url()} | ${request.failure()?.errorText ?? 'unknown'}`)
    );
    this.page.on('response', (response) => {
      const status = response.status();
      const request = response.request();
      const url = response.url();
      const isRelevantWriteRequest =
        status >= 400 &&
        /dashboard\.qorechain\.io/i.test(url) &&
        !request.isNavigationRequest() &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method().toUpperCase());

      if (isRelevantWriteRequest) {
        const summary = `${status} ${request.method()} ${url}`;
        this.lastHttpError = summary;
        this.log(`[response-error] ${summary}`);
      }
    });
    this.page.on('framenavigated', (frame) => {
      if (frame === this.page?.mainFrame()) {
        this.log(`[nav] main frame navigated to ${frame.url()}`);
      }
    });

    await this.logPageState('after-launch');
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close().catch(() => undefined);
      this.browser = null;
      this.page = null;
    }
  }

  async navigateToSignup(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    this.log(`[step] Opening signin page ${CONFIG.signinUrl}`);

    try {
      await this.page.goto(CONFIG.signinUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });

      await this.page.waitForSelector(
        'button[type="button"].w-full.py-4.px-6.rounded-xl.text-base.font-semibold.cursor-pointer',
        { state: 'attached', timeout: 3000 }
      ).catch(() => undefined);
      await this.logPageState('signin-page-loaded');

      const clicked = await this.clickSigninCardButton();
      if (!clicked) {
        await this.takeScreenshot('signin_button_missing');
        const buttonDump = await this.page.evaluate(() => {
          const runtime = globalThis as Record<string, any>;
          return Array.from(runtime.document?.querySelectorAll('button') || []).map((button: any) => ({
            text: (button.textContent || '').trim(),
            type: button.getAttribute('type'),
            className: button.getAttribute('class') || ''
          }));
        }).catch(() => []);
        this.log(`[click] visible button dump=${JSON.stringify(buttonDump)}`);
        throw new Error('Exact signin card button could not be clicked');
      }

      await sleep(MEDIUM_WAIT);
      await this.logPageState('after-giris-yap-click');
      await this.recoverFromAuthorize403();

      let dynamicSignupUrl = await this.getDynamicSignupUrl();
      if (!dynamicSignupUrl) {
        const directSignupUrl = this.buildAuthRouteFromCurrentUrl('signup');
        if (directSignupUrl) {
          this.log(`[signup] fallback direct signup url=${directSignupUrl}`);
          dynamicSignupUrl = directSignupUrl;
        }
      }
      if (!dynamicSignupUrl) {
        await this.takeScreenshot('signup_link_missing');
        throw new Error('Dynamic signup URL not found');
      }

      this.log(`[step] Navigating to fresh signup URL`);
      await this.page.goto(dynamicSignupUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });
      await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
      await sleep(SHORT_WAIT);
      await this.logPageState('signup-page-loaded');

      if (!(await this.hasSignupForm())) {
        await this.takeScreenshot('signup_form_missing');
        throw new Error('Signup form not found');
      }

      return true;
    } catch (error: any) {
      this.log(`[error] navigateToSignup failed: ${error.message}`);
      await this.takeScreenshot('signup_navigation_error');
      return false;
    }
  }

  async fillSignupForm(email: string, password: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    this.log('[step] Filling signup form');

    try {
      await this.fillFirst(['input[name="username"]', 'input[type="email"]'], email, 'email');
      await sleep(STEP_DELAY);
      await this.fillFirst(['input[name="password"]', 'input[type="password"]'], password, 'password');
      await sleep(STEP_DELAY);

      const submit = this.page.locator('button[name="signUpButton"], button:has-text("Sign up")').first();
      await submit.click({ force: true, delay: 30 });
      this.log('[form] clicked signup submit');

      await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined);
      await sleep(MEDIUM_WAIT);
      await this.logPageState('after-signup-submit');
      return true;
    } catch (error: any) {
      this.log(`[error] fillSignupForm failed: ${error.message}`);
      await this.takeScreenshot('signup_submit_error');
      return false;
    }
  }

  async acceptTermsOfService(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    this.log('[step] Handling terms page');

    try {
      if (!this.page.url().includes('/terms/accept')) {
        this.log(`[terms] current page is not terms, opening ${CONFIG.termsUrl}`);
        await this.page.goto(CONFIG.termsUrl, {
          waitUntil: 'domcontentloaded',
          timeout: CONFIG.timeout
        });
        await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
        await sleep(SHORT_WAIT);
      }
      await this.logPageState('terms-page-loaded');

      const termsScroller = this.page.locator('.overflow-y-auto.rounded-lg.border.p-6, .overflow-y-auto').first();
      if (await termsScroller.count() > 0) {
        for (let i = 0; i < 5; i++) {
          await termsScroller.evaluate((element) => {
            element.scrollTop = element.scrollTop + Math.max(800, element.clientHeight * 1.5);
          });
          await sleep(70);
        }
        await termsScroller.evaluate((element) => {
          element.scrollTop = element.scrollHeight;
        });
        this.log('[terms] scrolled terms container progressively to bottom');
        await sleep(120);
      }

      const checkbox = this.page.locator('input[type="checkbox"]').first();
      if (await checkbox.count() > 0) {
        const checkboxLabel = this.page.locator('label:has(input[type="checkbox"])').first();
        if (await checkboxLabel.count() > 0) {
          await checkboxLabel.click({ force: true }).catch(() => undefined);
          this.log('[terms] clicked checkbox label');
          await sleep(50);
        }

        await checkbox.evaluate((element) => {
          const input = element as any;
          input.disabled = false;
          input.checked = true;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }).catch(() => undefined);
        this.log('[terms] checkbox toggled programmatically');
        await sleep(50);
      }

      const acceptButton = this.page.locator('button');
      if (await acceptButton.count() === 0) {
        await this.takeScreenshot('terms_button_missing');
        throw new Error('Terms accept button not found');
      }

      const buttonDump = await this.page.evaluate(() => {
        const runtime = globalThis as Record<string, any>;
        return Array.from(runtime.document?.querySelectorAll('button') || []).map((button: any) => ({
          text: (button.textContent || '').replace(/\s+/g, ' ').trim(),
          disabled: Boolean(button.disabled)
        }));
      }).catch(() => []);
      this.log(`[terms] button dump before accept=${JSON.stringify(buttonDump)}`);

      const clickedAccept = await this.clickTermsAcceptButton();
      if (!clickedAccept) {
        await this.takeScreenshot('terms_accept_click_failed');
        throw new Error('Terms accept button could not be clicked');
      }

      await this.page.waitForURL((url) => !url.toString().includes('/terms/accept'), {
        timeout: 12000
      }).catch(() => undefined);
      await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => undefined);
      await sleep(MEDIUM_WAIT);
      await this.logPageState('after-terms-accept');
      const accepted = !this.page.url().includes('/terms/accept');
      this.log(`[terms] accepted=${accepted}`);
      if (!accepted) {
        await this.takeScreenshot('terms_not_accepted');
      }
      return accepted;
    } catch (error: any) {
      this.log(`[error] acceptTermsOfService failed: ${error.message}`);
      await this.takeScreenshot('terms_error');
      return false;
    }
  }

  async extractWalletAddress(): Promise<string | null> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    this.log('[step] Opening wallet flow');

    try {
      if (this.page.url().includes('/terms/accept')) {
        this.log('[wallet] still on terms page, stopping wallet extraction');
        await this.takeScreenshot('wallet_blocked_by_terms');
        return null;
      }

      await this.page.goto(CONFIG.walletUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });
      await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
      await sleep(SHORT_WAIT);
      await this.logPageState('wallet-page-loaded');
      await this.dismissCookieBanner();

      const createWalletClicked = await this.clickFirstMatchingButton(
        [/Yeni C.zdan Olu.tur/i, /Yeni Cuzdan Olustur/i, /Create.*Wallet/i],
        'create-wallet'
      );

      if (!createWalletClicked) {
        this.log('[wallet] create wallet button not found');
        await this.takeScreenshot('wallet_create_button_missing');
        return null;
      }

      await sleep(MEDIUM_WAIT);
      await this.logPageState('after-create-wallet-click');

      const walletLabel = generateWalletLabel();
      this.lastWalletLabel = walletLabel;
      this.log(`[wallet] generated wallet label=${walletLabel}`);
      await this.fillFirst(
        ['input[placeholder*="Ana Cüzdan"]', 'input[placeholder*="Ana Cuzdan"]', 'input[type="text"]'],
        walletLabel,
        'wallet-label'
      );
      await sleep(STEP_DELAY);

      const createNamedWalletClicked = await this.clickFirstMatchingButton(
        [/C.zdan Olu.tur/i, /Cuzdan Olustur/i, /Create Wallet/i],
        'confirm-wallet-create'
      );
      if (!createNamedWalletClicked) {
        await this.takeScreenshot('wallet_name_submit_missing');
        return null;
      }

      await sleep(LONG_WAIT);
      await this.logPageState('after-wallet-name-submit');

      const recoveryPhraseText = await this.getVisibleText([/\bqor1[0-9a-z]{20,}\b/i, /\b0x[a-f0-9]{40}\b/i]);
      if (recoveryPhraseText) {
        this.log(`[wallet] found address before recovery confirmation: ${recoveryPhraseText}`);
      }

      const phraseCheckbox = this.page.locator('input[type="checkbox"]').last();
      if (await phraseCheckbox.count() > 0) {
        await phraseCheckbox.evaluate((element) => {
          const input = element as any;
          input.disabled = false;
          input.checked = true;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }).catch(() => undefined);
        this.log('[wallet] recovery phrase checkbox toggled');
      }

      const readyClicked = await this.clickFirstMatchingButton([/Haz.r.m/i, /Hazirim/i, /I.?m Ready/i, /I am ready/i], 'ready-after-seed');
      if (!readyClicked) {
        await this.takeScreenshot('wallet_ready_missing');
      }

      await sleep(MEDIUM_WAIT);
      await this.logPageState('after-recovery-ready');

      await this.page.goto(CONFIG.faucetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });
      await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
      await sleep(SHORT_WAIT);
      await this.logPageState('faucet-page-loaded');
      await this.dismissCookieBanner();

      this.lastHttpError = null;
      const faucetClicked = await this.clickFirstMatchingButton([/Token Talep Et/i, /Claim Token/i, /Request Tokens/i], 'faucet-claim');
      if (!faucetClicked) {
        await this.takeScreenshot('faucet_button_missing');
      } else {
        await sleep(LONG_WAIT);
        await this.logPageState('after-faucet-click');
        if (this.lastHttpError) {
          this.log(`[faucet] request likely failed=${this.lastHttpError}`);
        }
      }

      await this.page.goto(CONFIG.walletUrl, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout
      });
      await this.page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
      await sleep(SHORT_WAIT);
      await this.logPageState('wallet-page-returned');

      const extractedWalletAddress =
        await this.getVisibleText([/\bqor1[0-9a-z]{20,}\b/i, /\b0x[a-f0-9]{40}\b/i], 'body');
      this.log(`[wallet] extracted wallet address candidate=${extractedWalletAddress ?? 'not-found'}`);

      if (CONFIG.transferAddress) {
        const sendClicked = await this.clickFirstMatchingButton([/G.nder/i, /Gonder/i, /Send/i], 'wallet-send');
        if (sendClicked) {
          await sleep(MEDIUM_WAIT);
          await this.logPageState('send-modal-opened');

          await this.fillFirst(
            ['input[placeholder*="qor1"]', 'input[placeholder*="Alıcı"]', 'input[placeholder*="Recipient"]', 'input[type="text"]'],
            CONFIG.transferAddress,
            'transfer-address'
          );
          await sleep(STEP_DELAY);

          let amountReady = false;
          const maxClicked = await this.clickFirstMatchingButton([/^MAX$/i], 'send-max');
          this.log(`[send] max clicked=${maxClicked}`);
          await sleep(STEP_DELAY);

          if (maxClicked) {
            const amountValueAfterMax = await this.page.locator('input[type="number"]').first().inputValue().catch(() => '');
            this.log(`[send] amount after MAX=${JSON.stringify(amountValueAfterMax)}`);
            amountReady = amountValueAfterMax.length > 0;
          }

          if (!amountReady) {
            amountReady = await this.fillAmountInput(CONFIG.transferAmount);
          }

          if (!amountReady) {
            await this.takeScreenshot('send_amount_missing');
            this.log('[send] amount could not be prepared');
          }

          const amountValueBeforeReview = await this.page.locator('input[type="number"]').first().inputValue().catch(() => '');
          this.log(`[send] amount before review=${JSON.stringify(amountValueBeforeReview)}`);

          const reviewClicked =
            await this.clickFirstMatchingButton([/..lemi G.zden Ge.ir/i, /Islemi Gozden Gecir/i, /Review/i], 'send-review') ||
            await this.clickFirstMatchingInput([/..lemi G.zden Ge.ir/i, /Islemi Gozden Gecir/i, /Review/i], 'send-review');
          this.log(`[send] review clicked=${reviewClicked}`);

          await sleep(MEDIUM_WAIT);
          await this.dismissCookieBanner();

          this.lastHttpError = null;
          const finalSendClicked =
            await this.clickFirstMatchingButton([/Onayla ve G.nder/i, /Onayla ve Gonder/i, /Confirm and Send/i, /Confirm\s*&\s*Send/i, /^Onayla$/i, /^Confirm$/i], 'send-final') ||
            await this.clickFirstMatchingInput([/Onayla ve G.nder/i, /Onayla ve Gonder/i, /Confirm and Send/i, /Confirm\s*&\s*Send/i, /^Onayla$/i, /^Confirm$/i], 'send-final');
          this.log(`[send] final send clicked=${finalSendClicked}`);
          this.transferCompleted = finalSendClicked ? await this.waitForTransferOutcome() : false;
          this.log(`[send] transfer confirmed=${this.transferCompleted}`);
          await sleep(LONG_WAIT);
          await this.logPageState('after-send-flow');
          if (finalSendClicked && !this.transferCompleted) {
            await this.takeScreenshot('send_not_confirmed');
          }
        } else {
          this.log('[send] send button not found, skipping transfer');
        }
      } else {
        this.log('[send] TRANSFER_WALLET_ADDRESS is empty, skipping transfer flow');
      }

      if (extractedWalletAddress) {
        return extractedWalletAddress;
      }

      await this.takeScreenshot('wallet_not_found');
      return null;
    } catch (error: any) {
      this.log(`[error] extractWalletAddress failed: ${error.message}`);
      await this.takeScreenshot('wallet_error');
      return null;
    }
  }

  async takeScreenshot(name: string): Promise<void> {
    if (!this.page) {
      return;
    }

    const directory = this.ensureDirectory(storage.screenshotsDir);
    const filename = path.join(
      directory,
      `${name}_${new Date().toISOString().replace(/[:.]/g, '-')}.png`
    );

    await this.page.screenshot({ path: filename, fullPage: true }).catch(() => undefined);
    this.log(`[screenshot] saved ${filename}`);
  }

  async run(options?: { keepBrowserOpen?: boolean }): Promise<WalletEntry | null> {
    const keepBrowserOpen = options?.keepBrowserOpen ?? true;
    const email = generateRandomEmail();
    const password = generatePassword();
    this.transferCompleted = false;
    this.lastWalletLabel = '';

    if (!isValidEmail(email)) {
      throw new Error('Generated email is invalid');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(`Generated password is invalid: ${passwordValidation.errors.join(', ')}`);
    }

    const walletEntry: WalletEntry = {
      id: generateId(),
      email,
      password,
      walletAddress: '',
      walletLabel: '',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    this.log(`[bot] generated credentials | email=${email} | password=${password}`);

    try {
      await this.launchBrowser();

      if (!(await this.navigateToSignup())) {
        throw new Error('Could not reach signup page');
      }

      if (!(await this.fillSignupForm(email, password))) {
        throw new Error('Could not submit signup form');
      }

      if (!(await this.acceptTermsOfService())) {
        throw new Error('Could not accept terms');
      }

      const walletAddress = await this.extractWalletAddress();
      if (!walletAddress && !this.transferCompleted) {
        throw new Error('Wallet address was not found');
      }

      walletEntry.walletAddress = walletAddress || '';
      walletEntry.walletLabel = this.lastWalletLabel || '';
      walletEntry.status = 'active';
      walletEntry.transferredTo = CONFIG.transferAddress || undefined;
      walletEntry.transferCompleted = this.transferCompleted;
      if (!walletAddress && this.transferCompleted) {
        walletEntry.errorMessage = 'Transfer completed but wallet address could not be extracted';
        this.log('[bot] Transfer completed, but wallet address could not be extracted');
      }
      saveWallet(walletEntry);
      this.log('[bot] Account created successfully');
      return walletEntry;
    } catch (error: any) {
      if (
        shutdownRequested &&
        typeof error?.message === 'string' &&
        /Target page, context or browser has been closed|browser has been closed|page has been closed/i.test(error.message)
      ) {
        walletEntry.status = 'pending';
        walletEntry.errorMessage = 'Interrupted by platform shutdown';
        walletEntry.walletLabel = this.lastWalletLabel || '';
        walletEntry.transferredTo = CONFIG.transferAddress || undefined;
        walletEntry.transferCompleted = this.transferCompleted;
        saveWallet(walletEntry);
        this.log('[bot] Run interrupted by platform shutdown during graceful stop');
        return null;
      }

      walletEntry.status = 'error';
      walletEntry.errorMessage = error.message;
      walletEntry.walletLabel = this.lastWalletLabel || '';
      walletEntry.transferredTo = CONFIG.transferAddress || undefined;
      walletEntry.transferCompleted = this.transferCompleted;
      saveWallet(walletEntry);
      await this.takeScreenshot('bot_failure');
      this.log(`[bot] Run failed: ${error.message}`);
      return null;
    } finally {
      if (keepBrowserOpen) {
        await this.waitForManualClose();
      } else {
        await this.closeBrowser();
      }
    }
  }
}

export { QoreChainBot, CONFIG };

if (require.main === module) {
  (async () => {
    const bot = new QoreChainBot();
    await bot.run();
    process.exit(0);
  })();
}
