/**
 * Storage module for managing wallet data in a JSON file.
 */

import * as fs from 'fs';
import * as path from 'path';
import { storage as storageConfig } from './config';

export interface WalletEntry {
  id: string;
  email: string;
  password: string;
  walletAddress: string;
  walletLabel?: string;
  createdAt: string;
  status: 'active' | 'error' | 'pending';
  errorMessage?: string;
  transferredTo?: string;
  transferTxHash?: string;
  transferCompleted?: boolean;
}

function resolveStoragePath(targetPath: string): string {
  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }

  return path.resolve(storageConfig.baseDir, targetPath);
}

const WALLETS_FILE = resolveStoragePath(storageConfig.walletsFile);
const SCREENSHOTS_DIR = resolveStoragePath(storageConfig.screenshotsDir);
const DATA_DIR = path.dirname(WALLETS_FILE);

function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureDataDirectory(): void {
  ensureDirectory(DATA_DIR);
  ensureDirectory(SCREENSHOTS_DIR);
}

export function loadWallets(): WalletEntry[] {
  ensureDataDirectory();

  if (!fs.existsSync(WALLETS_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(WALLETS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading wallets:', error);
    return [];
  }
}

export function saveWallet(entry: WalletEntry): boolean {
  ensureDataDirectory();

  try {
    const wallets = loadWallets();
    wallets.push(entry);
    fs.writeFileSync(WALLETS_FILE, JSON.stringify(wallets, null, 2), 'utf-8');
    console.log(`Wallet saved for ${entry.email}`);
    return true;
  } catch (error) {
    console.error('Error saving wallet:', error);
    return false;
  }
}

export function updateWallet(email: string, updates: Partial<WalletEntry>): boolean {
  try {
    const wallets = loadWallets();
    const index = wallets.findIndex((wallet) => wallet.email === email);

    if (index === -1) {
      console.error(`Wallet not found for email: ${email}`);
      return false;
    }

    wallets[index] = { ...wallets[index], ...updates };
    fs.writeFileSync(WALLETS_FILE, JSON.stringify(wallets, null, 2), 'utf-8');
    console.log(`Wallet updated for ${email}`);
    return true;
  } catch (error) {
    console.error('Error updating wallet:', error);
    return false;
  }
}

export function deleteWallet(email: string): boolean {
  try {
    const wallets = loadWallets();
    const filteredWallets = wallets.filter((wallet) => wallet.email !== email);

    if (filteredWallets.length === wallets.length) {
      console.error(`Wallet not found for email: ${email}`);
      return false;
    }

    fs.writeFileSync(WALLETS_FILE, JSON.stringify(filteredWallets, null, 2), 'utf-8');
    console.log(`Wallet deleted for ${email}`);
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return false;
  }
}

export function getAllWallets(): WalletEntry[] {
  return loadWallets();
}

export function getWalletByEmail(email: string): WalletEntry | undefined {
  return loadWallets().find((wallet) => wallet.email === email);
}

export function initializeStorage(): void {
  ensureDataDirectory();

  if (!fs.existsSync(WALLETS_FILE)) {
    fs.writeFileSync(WALLETS_FILE, '[]', 'utf-8');
    console.log('Storage initialized');
  }
}
