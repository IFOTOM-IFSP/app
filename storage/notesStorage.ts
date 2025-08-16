import { handleError } from '@/services/errorHandler';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export interface Note {
  id: number;
  title: string;
  content: string;
  type: 'quick' | 'analysis' | 'task'; 
  analysisId?: number;
  analysisName?: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteDatabaseRow {
  id: number;
  title: string;
  content: string;
  type: 'quick' | 'analysis' | 'task'; 
  analysis_id: number | null;
  analysis_name: string | null;
  created_at: string;
  updated_at: string;
}

const DATABASE_NAME = 'analysis_history.db';
let dbInstance: SQLiteDatabase | null = null;

const mapRowToNote = (row: NoteDatabaseRow): Note => ({
  id: row.id,
  title: row.title,
  content: row.content,
  type: row.type,
  analysisId: row.analysis_id ?? undefined,
  analysisName: row.analysis_name ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});


async function getNotesDB(): Promise<SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  try {
  dbInstance = await openDatabaseAsync(DATABASE_NAME);
  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT NOT NULL CHECK(type IN ('quick', 'analysis', 'task')),
      analysis_id INTEGER,
      analysis_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (analysis_id) REFERENCES analysis_history(id) ON DELETE SET NULL
    );
  `);
  console.log("SQLite [notesStorage]: Tabela 'notes' pronta.");
  return dbInstance;}
  catch (error) {
    throw handleError(error, 'notesStorage:getNotesDB');
  }
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }): Promise<Note> {
 try {
    const db = await getNotesDB();
    const now = new Date().toISOString();

    if (note.id) { 
      await db.runAsync(
        'UPDATE notes SET title = ?, content = ?, type = ?, analysis_id = ?, analysis_name = ?, updated_at = ? WHERE id = ?;',
        [note.title, note.content, note.type, note.analysisId ?? null, note.analysisName ?? null, now, note.id]
      );
      
      const updatedNote = await getNoteById(note.id);
      if (!updatedNote) throw new Error("Falha ao encontrar a nota após a atualização.");
      return updatedNote;
    } else { 
      const result = await db.runAsync(
        'INSERT INTO notes (title, content, type, analysis_id, analysis_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [note.title, note.content, note.type, note.analysisId ?? null, note.analysisName ?? null, now, now]
      );
      const newId = result.lastInsertRowId;
      return { ...note, id: newId, createdAt: now, updatedAt: now };
    }
  } catch (error) {
    handleError(error, 'notesStorage:saveNote', { noteData: note });
    throw error;
  }
}

export async function getAllNotes(): Promise<Note[]> {
  try {
    const db = await getNotesDB();
    const rows = await db.getAllAsync<NoteDatabaseRow>('SELECT * FROM notes ORDER BY updated_at DESC;');
    return rows.map(mapRowToNote);
  } catch (error) {
    handleError(error, 'notesStorage:getAllNotes');
    throw error;
  }
}

export async function getNoteById(id: number): Promise<Note | null> {
  try {
    const db = await getNotesDB();
    const row = await db.getFirstAsync<NoteDatabaseRow>('SELECT * FROM notes WHERE id = ?;', [id]);
    return row ? mapRowToNote(row) : null;
  } catch (error) {
    handleError(error, 'notesStorage:getNoteById', { noteId: id });
    throw error;
  }
}

export async function deleteNote(id: number): Promise<void> {
  try {
    const db = await getNotesDB();
    await db.runAsync('DELETE FROM notes WHERE id = ?;', [id]);
  } catch (error) {
    handleError(error, 'notesStorage:deleteNote', { noteId: id });
    throw error;
  }
}