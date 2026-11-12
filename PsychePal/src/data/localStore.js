import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'psychepal.db';
let databasePromise;
let activeAccountId = null;

const LEGACY_DATA_KEYS = [
  'moodRecords',
  'reflectionNotes',
  'diaryEntries',
  'gratitudeEntries',
  'personalGoals',
  'profileSettings',
];

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS local_accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL COLLATE NOCASE UNIQUE,
          display_name TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS account_data (
          account_id INTEGER NOT NULL REFERENCES local_accounts(id) ON DELETE CASCADE,
          data_key TEXT NOT NULL,
          value TEXT NOT NULL,
          PRIMARY KEY (account_id, data_key)
        );
        CREATE TABLE IF NOT EXISTS local_metadata (
          metadata_key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return database;
    })().catch(error => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

export function setActiveAccountId(accountId) {
  activeAccountId = Number.isInteger(accountId) && accountId > 0 ? accountId : null;
}

function requireActiveAccountId() {
  if (activeAccountId === null) {
    throw new Error('Sign in to access your local profile data.');
  }
  return activeAccountId;
}

export async function getItem(key) {
  const database = await getDatabase();
  const row = await database.getFirstAsync(
    'SELECT value FROM account_data WHERE account_id = ? AND data_key = ?',
    requireActiveAccountId(),
    key,
  );
  return row ? row.value : null;
}

export async function setItem(key, value) {
  if (typeof value !== 'string') {
    throw new TypeError('Local profile data must be saved as a string.');
  }
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO account_data (account_id, data_key, value)
     VALUES (?, ?, ?)
     ON CONFLICT(account_id, data_key) DO UPDATE SET value = excluded.value`,
    requireActiveAccountId(),
    key,
    value,
  );
}

export async function multiRemove(keys) {
  if (!Array.isArray(keys) || keys.length === 0) return;
  const database = await getDatabase();
  const placeholders = keys.map(() => '?').join(', ');
  await database.runAsync(
    `DELETE FROM account_data WHERE account_id = ? AND data_key IN (${placeholders})`,
    [requireActiveAccountId(), ...keys],
  );
}

export { LEGACY_DATA_KEYS };
