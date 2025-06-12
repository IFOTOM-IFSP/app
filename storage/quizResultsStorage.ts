
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export type QuizResult = {
  id?: number; 
  quizId: string;
  score: number; 
  completedAt: string; 
};




const QUIZ_DATABASE_NAME = 'quizzes.db';
let quizDbInstance: SQLiteDatabase | null = null;


async function getQuizDB(): Promise<SQLiteDatabase> {
  if (!quizDbInstance) {
    console.log(`SQLite [quizStorage]: Abrindo/criando banco de dados '${QUIZ_DATABASE_NAME}'...`);
    quizDbInstance = await openDatabaseAsync(QUIZ_DATABASE_NAME);
    console.log("SQLite [quizStorage]: Banco de dados aberto. Verificando/Criando tabela 'quiz_results'...");
    
    await quizDbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId TEXT NOT NULL,
        score REAL NOT NULL,
        completedAt TEXT NOT NULL
      );
    `);
    console.log("SQLite [quizStorage]: Tabela 'quiz_results' pronta.");
  }
  return quizDbInstance;
}

getQuizDB().catch(err => console.error("SQLite [quizStorage]: Erro crítico ao inicializar o DB de quizzes:", err));


export async function saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<void> {
  const db = await getQuizDB();
  await db.runAsync(
    'INSERT INTO quiz_results (quizId, score, completedAt) VALUES (?, ?, ?);',
    [result.quizId, result.score, result.completedAt]
  );
  console.log(`SQLite [quizStorage]: Resultado para o quizId '${result.quizId}' salvo com sucesso.`);
}


export async function getAllQuizResults(): Promise<QuizResult[]> {
  const db = await getQuizDB();
  const allRows = await db.getAllAsync<QuizResult>('SELECT * FROM quiz_results ORDER BY completedAt DESC;');
  return allRows;
}


export async function getHighScoreForQuiz(quizId: string): Promise<number> {
    const db = await getQuizDB();
    const result = await db.getFirstAsync<{ max_score: number | null }>(
      'SELECT MAX(score) as max_score FROM quiz_results WHERE quizId = ?;',
      [quizId]
    );
    return result?.max_score ?? 0;
}


export async function deleteAllQuizResults(): Promise<void> {
  const db = await getQuizDB();
  await db.runAsync('DELETE FROM quiz_results;');
  console.log("SQLite [quizStorage]: Todos os resultados de quizzes foram deletados.");
}
