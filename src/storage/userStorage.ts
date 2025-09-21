import { handleError } from '@/services/errorHandler';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const USER_DATABASE_NAME = 'user_profile.db';
const USER_PROFILE_ID = 1; 
let userDbInstance: SQLiteDatabase | null = null;

async function getUserDB(): Promise<SQLiteDatabase> {
  if (userDbInstance) {
    return userDbInstance;
  }
  try {
    userDbInstance = await openDatabaseAsync(USER_DATABASE_NAME);
    
    await userDbInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        firstLaunchDone INTEGER DEFAULT 0 NOT NULL -- 0 para false, 1 para true
      );
      INSERT OR IGNORE INTO user_profile (id, name, firstLaunchDone) VALUES (${USER_PROFILE_ID}, NULL, 0);
    `);
    
    return userDbInstance;
  } catch (error) {
    handleError(error, 'userStorage:getUserDB');
    throw new Error("Não foi possível inicializar a base de dados do utilizador.");
  }
}

getUserDB();

export const saveUserName = async (name: string): Promise<void> => {
  try {
    const db = await getUserDB();
    await db.runAsync(
      'UPDATE user_profile SET name = ?, firstLaunchDone = 1 WHERE id = ?;',
      [name, USER_PROFILE_ID]
    );
  } catch (error) {
    handleError(error, 'userStorage:saveUserName', { userName: name });
    throw error;
  }
};

export const getUserName = async (): Promise<string | null> => {
  try {
    const db = await getUserDB();
    const result = await db.getFirstAsync<{ name: string | null }>(
      'SELECT name FROM user_profile WHERE id = ?;',
      [USER_PROFILE_ID]
    );
    return result?.name ?? null;
  } catch (error) {
    handleError(error, 'userStorage:getUserName');
    throw error;
  }
};

export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const db = await getUserDB();
    const result = await db.getFirstAsync<{ firstLaunchDone: number }>(
      'SELECT firstLaunchDone FROM user_profile WHERE id = ?;',
      [USER_PROFILE_ID]
    );
    return result?.firstLaunchDone === 0;
  } catch (error) {
    handleError(error, 'userStorage:isFirstLaunch');
    return true;
  }
};

export const clearFirstLaunch = async (): Promise<void> => {
  try {
    const db = await getUserDB();
    await db.runAsync(
      'UPDATE user_profile SET name = NULL, firstLaunchDone = 0 WHERE id = ?;',
      [USER_PROFILE_ID]
    );
  } catch (error) {
    handleError(error, 'userStorage:clearFirstLaunch');
    throw error;
  }
};
