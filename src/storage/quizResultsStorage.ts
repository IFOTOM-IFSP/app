import { handleError } from '@/services/errorHandler';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export type QuizResult = {
  id: number; 
  quizId: string;
  score: number; 
  completedAt: string; 
};

const QUIZ_DATABASE_NAME = 'quizzes.db';
let quizDbInstance: SQLiteDatabase | null = null;

async function getQuizDB(): Promise<SQLiteDatabase> {
  if (quizDbInstance) {
    return quizDbInstance;
  }
  try {
    quizDbInstance = await openDatabaseAsync(QUIZ_DATABASE_NAME);
    await quizDbInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId TEXT NOT NULL,
        score REAL NOT NULL,
        completedAt TEXT NOT NULL
      );
    `);
    return quizDbInstance;
  } catch (error) {
    handleError(error, 'quizStorage:getQuizDB');
    throw new Error("Não foi possível inicializar a base de dados de quizzes.");
  }
}

getQuizDB();

export async function saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<QuizResult> {
  try {
    const db = await getQuizDB();
    const dbResult = await db.runAsync(
      'INSERT INTO quiz_results (quizId, score, completedAt) VALUES (?, ?, ?);',
      [result.quizId, result.score, result.completedAt]
    );
    const newId = dbResult.lastInsertRowId;
    return { ...result, id: newId };
  } catch (error) {
    handleError(error, 'quizStorage:saveQuizResult', { quizResult: result });
    throw error;
  }
}

export async function getAllQuizResults(): Promise<QuizResult[]> {
  try {
    const db = await getQuizDB();
    return await db.getAllAsync<QuizResult>('SELECT * FROM quiz_results ORDER BY completedAt DESC;');
  } catch (error) {
    handleError(error, 'quizStorage:getAllQuizResults');
    throw error;
  }
}

export async function getHighScoreForQuiz(quizId: string): Promise<number> {
  try {
    const db = await getQuizDB();
    const result = await db.getFirstAsync<{ max_score: number | null }>(
      'SELECT MAX(score) as max_score FROM quiz_results WHERE quizId = ?;',
      [quizId]
    );
    return result?.max_score ?? 0;
  } catch (error) {
    handleError(error, 'quizStorage:getHighScoreForQuiz', { quizId });
    throw error;
  }
}

export async function deleteAllQuizResults(): Promise<void> {
  try {
    const db = await getQuizDB();
    await db.runAsync('DELETE FROM quiz_results;');
  } catch (error) {
    handleError(error, 'quizStorage:deleteAllQuizResults');
    throw error;
  }
}
