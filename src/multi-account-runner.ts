/**
 * Multi-account runner.
 * Set TIMING_MULTI_ACCOUNT_COUNT=0 for infinite loop mode.
 */

import { QoreChainBot } from './bot';
import { getAllWallets } from './storage';
import { timing } from './config';

interface RunConfig {
  count: number;
  delayBetweenRuns: number;
}

let shutdownRequested = false;

function installSignalHandlers(): void {
  const requestShutdown = (signal: string) => {
    if (shutdownRequested) {
      return;
    }

    shutdownRequested = true;
    console.log(`[loop] Received ${signal}. Current run will finish, then the worker will stop gracefully.`);
  };

  process.on('SIGTERM', () => requestShutdown('SIGTERM'));
  process.on('SIGINT', () => requestShutdown('SIGINT'));
}

async function runMultipleAccounts(config: RunConfig): Promise<void> {
  const { count, delayBetweenRuns } = config;
  const infiniteMode = count <= 0;

  installSignalHandlers();

  console.log(`\n${'='.repeat(60)}`);
  console.log('[loop] Starting multi-account runner');
  console.log('='.repeat(60));
  console.log(`[loop] Total accounts: ${infiniteMode ? 'infinite' : count}`);
  console.log(`[loop] Delay between runs: ${delayBetweenRuns / 1000}s`);
  console.log('='.repeat(60));

  const results = {
    success: 0,
    failed: 0,
    total: 0
  };

  for (let i = 1; infiniteMode || i <= count; i++) {
    if (shutdownRequested) {
      console.log('[loop] Shutdown requested before starting the next run. Stopping loop.');
      break;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[loop] Creating account ${infiniteMode ? i : `${i}/${count}`}`);
    console.log('='.repeat(60));

    try {
      const bot = new QoreChainBot();
      const result = await bot.run({ keepBrowserOpen: false });

      if (shutdownRequested) {
        console.log('[loop] Current run ended during shutdown. It will not be counted as a failure.');
        break;
      }

      if (result && result.status === 'active') {
        results.success++;
        console.log(`[loop] Account ${i} completed successfully`);
      } else {
        results.failed++;
        console.log(`[loop] Account ${i} failed`);
      }
    } catch (error: any) {
      results.failed++;
      console.error(`[loop] Account ${i} error: ${error.message}`);
    }

    results.total++;
    console.log(`[loop] Progress: success=${results.success}, failed=${results.failed}, total=${results.total}`);

    if (shutdownRequested) {
      console.log('[loop] Graceful shutdown completed after current run.');
      break;
    }

    if (infiniteMode || i < count) {
      console.log(`[loop] Waiting ${delayBetweenRuns / 1000}s before next run...`);
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRuns));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('[loop] Final summary');
  console.log('='.repeat(60));
  console.log(`[loop] Successful: ${results.success}`);
  console.log(`[loop] Failed: ${results.failed}`);
  console.log(`[loop] Stored wallets: ${getAllWallets().length}`);
  console.log('='.repeat(60));
}

const CONFIG: RunConfig = {
  count: timing.multiAccountCount,
  delayBetweenRuns: timing.multiAccountDelay
};

if (require.main === module) {
  (async () => {
    try {
      await runMultipleAccounts(CONFIG);
      process.exit(0);
    } catch (error: any) {
      console.error(`[loop] Runner failed: ${error.message}`);
      process.exit(1);
    }
  })();
}

export { runMultipleAccounts };
