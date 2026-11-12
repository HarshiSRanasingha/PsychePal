import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { getDatabase, LEGACY_DATA_KEYS } from './localStore';

const LEGACY_MIGRATION_KEY = 'legacy_data_migrated';
const PASSWORD_ITERATIONS = 310000;

async function derivePasswordHash(password, salt) {
  const derived = await pbkdf2Async(
    sha256,
    utf8ToBytes(password),
    hexToBytes(salt),
    { c: PASSWORD_ITERATIONS, dkLen: 32 },
  );
  return bytesToHex(derived);
}

function hashesMatch(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function accountFromRow(row) {
  return { id: row.id, email: row.email, displayName: row.display_name };
}

export async function finishPendingLegacyCleanup() {
  const database = await getDatabase();
  const migration = await database.getFirstAsync(
    'SELECT value FROM local_metadata WHERE metadata_key = ?',
    LEGACY_MIGRATION_KEY,
  );
  if (migration) {
    await AsyncStorage.multiRemove(LEGACY_DATA_KEYS);
  }
}

export async function listLocalAccounts() {
  const database = await getDatabase();
  return database.getAllAsync(
    'SELECT id, email, display_name FROM local_accounts ORDER BY id',
  );
}

export async function registerLocalAccount({ displayName, email, password }) {
  const database = await getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await database.getFirstAsync(
    'SELECT id FROM local_accounts WHERE email = ?',
    normalizedEmail,
  );
  if (existing) {
    throw new Error('An account with this email already exists on this device.');
  }

  const salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
  const passwordHash = await derivePasswordHash(password, salt);
  const legacyValues = await AsyncStorage.multiGet(LEGACY_DATA_KEYS);
  let accountId;

  try {
    await database.withTransactionAsync(async () => {
      const result = await database.runAsync(
        `INSERT INTO local_accounts (email, display_name, password_salt, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        normalizedEmail,
        displayName.trim(),
        salt,
        passwordHash,
        new Date().toISOString(),
      );
      accountId = result.lastInsertRowId;

      const migration = await database.getFirstAsync(
        'SELECT value FROM local_metadata WHERE metadata_key = ?',
        LEGACY_MIGRATION_KEY,
      );
      let profileSettingsValue = null;
      if (!migration) {
        for (const [key, value] of legacyValues) {
          if (value !== null) {
            await database.runAsync(
              'INSERT INTO account_data (account_id, data_key, value) VALUES (?, ?, ?)',
              accountId,
              key,
              value,
            );
            if (key === 'profileSettings') profileSettingsValue = value;
          }
        }
        await database.runAsync(
          'INSERT INTO local_metadata (metadata_key, value) VALUES (?, ?)',
          LEGACY_MIGRATION_KEY,
          '1',
        );
      }
      if (profileSettingsValue === null) {
        await database.runAsync(
          'INSERT INTO account_data (account_id, data_key, value) VALUES (?, ?, ?)',
          accountId,
          'profileSettings',
          JSON.stringify({
            preferredName: displayName.trim(),
            avatar: '☁️',
            showDailyMotivation: true,
            showSelfCare: true,
          }),
        );
      }
    });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed: local_accounts.email')) {
      throw new Error('An account with this email already exists on this device.');
    }
    throw error;
  }

  let migrationWarning = null;
  try {
    await AsyncStorage.multiRemove(LEGACY_DATA_KEYS);
  } catch (error) {
    migrationWarning = `Your account was created, but the old local copies could not be removed: ${error.message || 'storage error'}`;
  }
  return {
    account: { id: accountId, email: normalizedEmail, displayName: displayName.trim() },
    migrationWarning,
  };
}

export async function loginLocalAccount({ email, password }) {
  const database = await getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const row = await database.getFirstAsync(
    `SELECT id, email, display_name, password_salt, password_hash
     FROM local_accounts WHERE email = ?`,
    normalizedEmail,
  );
  if (!row) {
    throw new Error('Email or password is incorrect.');
  }

  const passwordHash = await derivePasswordHash(password, row.password_salt);
  if (!hashesMatch(passwordHash, row.password_hash)) {
    throw new Error('Email or password is incorrect.');
  }
  return accountFromRow(row);
}
