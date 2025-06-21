import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const USER_DATABASE_NAME = 'user_profile.db';
let userDbInstance: SQLiteDatabase | null = null;
const USER_PROFILE_ID = 1;


async function getUserDB(): Promise<SQLiteDatabase> {
  if (!userDbInstance) {
    console.log(`SQLite [userStorage]: Abrindo/criando banco de dados '${USER_DATABASE_NAME}'...`);
    userDbInstance = await openDatabaseAsync(USER_DATABASE_NAME);
    console.log("SQLite [userStorage]: Banco de dados aberto. Verificando/Criando tabela 'user_profile'...");
    
    await userDbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        firstLaunchDone INTEGER DEFAULT 0 -- 0 para false (primeiro acesso), 1 para true (não é mais primeiro acesso)
      );
    `);

    await userDbInstance.runAsync(
      'INSERT OR IGNORE INTO user_profile (id, name, firstLaunchDone) VALUES (?, NULL, ?);',
      [USER_PROFILE_ID, 0] 
    );
    console.log("SQLite [userStorage]: Tabela 'user_profile' pronta ou já existente com linha padrão.");
  }
  return userDbInstance;
}

getUserDB().catch(err => console.error("SQLite [userStorage]: Erro crítico ao inicializar o DB do usuário:", err));

export const saveUserName = async (name: string): Promise<void> => {
  const db = await getUserDB();
  try {
    console.log("SQLite [userStorage]: Salvando nome do usuário e atualizando firstLaunchDone para 1:", name);
    const result = await db.runAsync(
      'UPDATE user_profile SET name = ?, firstLaunchDone = 1 WHERE id = ?;',
      [name, USER_PROFILE_ID]
    );
    if (result.changes > 0) {
      console.log("SQLite [userStorage]: Nome do usuário salvo com sucesso.");
    } else {
      console.warn("SQLite [userStorage]: Nenhum usuário encontrado para atualizar. Verifique a inicialização do DB.");
    }
  } catch (error) {
    console.error('SQLite [userStorage]: Erro ao salvar o nome do usuário:', error);
    throw error;
  }
};

export const getUserName = async (): Promise<string | null> => {
  const db = await getUserDB();
  try {
    console.log("SQLite [userStorage]: Buscando nome do usuário...");
    const result = await db.getFirstAsync<{ name: string | null }>(
      'SELECT name FROM user_profile WHERE id = ?;',
      [USER_PROFILE_ID]
    );
    const userName = result?.name || null;
    console.log("SQLite [userStorage]: Nome do usuário encontrado:", userName);
    return userName;
  } catch (error) {
    console.error('SQLite [userStorage]: Erro ao buscar o nome do usuário:', error);
    return null;
  }
};


export const isFirstLaunch = async (): Promise<boolean> => {
  const db = await getUserDB();
  try {
    console.log("SQLite [userStorage]: Verificando status de primeiro lançamento...");
    const result = await db.getFirstAsync<{ firstLaunchDone: number }>(
      'SELECT firstLaunchDone FROM user_profile WHERE id = ?;',
      [USER_PROFILE_ID]
    );
   
    const firstLaunchStatus = result?.firstLaunchDone === 0;
    console.log("SQLite [userStorage]: É o primeiro lançamento?", firstLaunchStatus);
    return firstLaunchStatus;
  } catch (error) {
    console.error('SQLite [userStorage]: Erro ao verificar o primeiro lançamento:', error);
    return true;
  }
};

export const clearFirstLaunch = async (): Promise<void> => {
  const db = await getUserDB();
  try {
    console.log("SQLite [userStorage]: Limpando dados do usuário (resetando para primeiro acesso)...");
    await db.runAsync(
      'UPDATE user_profile SET name = NULL, firstLaunchDone = 0 WHERE id = ?;',
      [USER_PROFILE_ID]
    );
    console.log("SQLite [userStorage]: Dados do usuário limpos.");
  } catch (error) {
    console.error('SQLite [userStorage]: Erro ao limpar dados do usuário:', error);
    throw error;
  }
};