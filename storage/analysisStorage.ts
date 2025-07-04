import { AnalysisSetup } from '@/interfaces/analysis';
import { ApiAnalysisResult } from '@/schema/apiSchema';
import { openDatabaseAsync, type SQLiteDatabase, type SQLiteRunResult } from 'expo-sqlite';

export interface SavedAnalysis {
  id: number;
  createdAt: string;
  analysisSetup: AnalysisSetup;
  analysisResult: ApiAnalysisResult;
}


interface DatabaseRow {
  id: number;
  createdAt: string;
  analysisSetup: string;
  analysisResult: string;
}


const DATABASE_NAME = 'analysis_history.db';
const CURRENT_DB_VERSION = 1; 

let dbInstance: SQLiteDatabase | null = null;


async function runMigrations(db: SQLiteDatabase, fromVersion: number) {
  console.log(`SQLite [analysisStorage]: Iniciando migrações da versão ${fromVersion}...`);
  
  // Exemplo de uma futura migração para a versão 2
  // if (fromVersion < 2) {
  //   console.log("SQLite [analysisStorage]: Aplicando migração para v2: Adicionando coluna 'notes'...");
  //   await db.execAsync(`
  //     ALTER TABLE analysis_history ADD COLUMN notes TEXT;
  //   `);
  // }

  console.log("SQLite [analysisStorage]: Migrações concluídas.");
}


async function getAnalysisDB(): Promise<SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDatabaseAsync(DATABASE_NAME);
  
  await dbInstance.execAsync('PRAGMA journal_mode = WAL;');
  
  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      analysisSetup TEXT NOT NULL,
      analysisResult TEXT NOT NULL
    );
  `);

  const versionResult = await dbInstance.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = versionResult?.user_version ?? 0; 

  if (currentVersion < CURRENT_DB_VERSION) {
    await runMigrations(dbInstance, currentVersion);
    await dbInstance.execAsync(`PRAGMA user_version = ${CURRENT_DB_VERSION}`);
    console.log(`SQLite [analysisStorage]: Base de dados atualizada para a versão ${CURRENT_DB_VERSION}.`);
  } else {
    console.log(`SQLite [analysisStorage]: Base de dados já está na versão mais recente (${currentVersion}).`);
  }

  return dbInstance;
}


// CORRIGIDO: A função agora retorna o ID da análise guardada (Promise<number>)
export async function saveAnalysis(analysis: Omit<SavedAnalysis, 'id'>): Promise<number> {
  try {
    const db = await getAnalysisDB();
    
    const setupJson = JSON.stringify(analysis.analysisSetup);
    const resultJson = JSON.stringify(analysis.analysisResult);

    // A função `runAsync` retorna um objeto que contém o ID do último registo inserido.
    const result: SQLiteRunResult = await db.runAsync(
      'INSERT INTO analysis_history (createdAt, analysisSetup, analysisResult) VALUES (?, ?, ?);',
      [analysis.createdAt, setupJson, resultJson]
    );
    console.log(`SQLite [analysisStorage]: Análise '${analysis.analysisSetup.analysisName}' guardada com sucesso. ID: ${result.lastInsertRowId}`);
    
    // Retorna o ID do novo registo.
    return result.lastInsertRowId;

  } catch (error) {
    console.error("SQLite [analysisStorage]: Erro ao guardar análise.", error);
    throw error;
  }
}

export async function getAnalysisHistory(): Promise<SavedAnalysis[]> {
  try {
    const db = await getAnalysisDB();
    const allRows = await db.getAllAsync<DatabaseRow>('SELECT * FROM analysis_history ORDER BY createdAt DESC;');
    
    return allRows.map(row => ({
      id: row.id,
      createdAt: row.createdAt,
      analysisSetup: JSON.parse(row.analysisSetup),
      analysisResult: JSON.parse(row.analysisResult),
    }));
  } catch (error) {
    console.error("SQLite [analysisStorage]: Erro ao obter histórico de análises.", error);
    return []; 
  }
}

export async function deleteAnalysis(id: number): Promise<void> {
  try {
    const db = await getAnalysisDB();
    await db.runAsync('DELETE FROM analysis_history WHERE id = ?;', [id]);
    console.log(`SQLite [analysisStorage]: Análise com ID ${id} apagada.`);
  } catch (error) {
    console.error(`SQLite [analysisStorage]: Erro ao apagar análise com ID ${id}.`, error);
    throw error;
  }
}

export async function clearAllAnalyses(): Promise<void> {
  try {
    const db = await getAnalysisDB();
    await db.runAsync('DELETE FROM analysis_history;');
    console.log("SQLite [analysisStorage]: Todo o histórico de análises foi apagado.");
  } catch (error) {
    console.error("SQLite [analysisStorage]: Erro ao limpar o histórico de análises.", error);
    throw error;
  }
}
