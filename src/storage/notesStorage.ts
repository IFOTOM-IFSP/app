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
  tags: string[]; 
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

const mapRowToNoteBase = (row: NoteDatabaseRow): Omit<Note, 'tags'> => ({
  id: row.id,
  title: row.title,
  content: row.content,
  type: row.type,
  analysisId: row.analysis_id ?? undefined,
  analysisName: row.analysis_name ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
} as const);

function normalizeTags(input?: string[]): string[] {
  if (!input || !input.length) return [];
  const set = new Set(
    input
      .map((t) => (t ?? '').trim())
      .filter(Boolean)
      .map((t) => t.toLowerCase())
  );
  return Array.from(set);
}

async function runMigrations(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        created_at TEXT,
        updated_at TEXT
      );
    `);
  await db.execAsync(`
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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (note_id, tag_id),
      FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_note_tags_note ON note_tags(note_id);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
  `);
}

async function getNotesDB(): Promise<SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  try {
    dbInstance = await openDatabaseAsync(DATABASE_NAME);
    await runMigrations(dbInstance);
    return dbInstance;
  } catch (error) {
    throw handleError(error, 'notesStorage:getNotesDB');
  }
}

async function upsertTags(db: SQLiteDatabase, tags: string[]): Promise<number[]> {
  if (!tags.length) return [];
  const ids: number[] = [];
  await db.execAsync('BEGIN;');
  try {
    for (const name of tags) {
      await db.runAsync('INSERT OR IGNORE INTO tags (name) VALUES (?);', [name]);
      const row = await db.getFirstAsync<{ id: number }>('SELECT id FROM tags WHERE name = ?;', [name]);
      if (!row) throw new Error('Falha ao upsert tag: ' + name);
      ids.push(row.id);
    }
    await db.execAsync('COMMIT;');
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    throw e;
  }
  return ids;
}

async function setNoteTags(db: SQLiteDatabase, noteId: number, tags: string[]) {
  await db.execAsync('BEGIN;');
  try {
    await db.runAsync('DELETE FROM note_tags WHERE note_id = ?;', [noteId]);
    if (tags.length) {
      const tagIds = await upsertTags(db, tags);
      for (const tagId of tagIds) {
        await db.runAsync('INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?);', [noteId, tagId]);
      }
    }
    await db.execAsync('COMMIT;');
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    throw e;
  }
}

async function getTagsForNoteIds(db: SQLiteDatabase, noteIds: number[]): Promise<Map<number, string[]>> {
  const map = new Map<number, string[]>();
  if (!noteIds.length) return map;

  const placeholders = noteIds.map(() => '?').join(',');
  const rows = await db.getAllAsync<{ note_id: number; name: string }>(
    `SELECT nt.note_id, t.name
     FROM note_tags nt
     JOIN tags t ON t.id = nt.tag_id
     WHERE nt.note_id IN (${placeholders})
     ORDER BY t.name ASC;`,
    noteIds as any
  );

  for (const r of rows) {
    const arr = map.get(r.note_id) ?? [];
    arr.push(r.name);
    map.set(r.note_id, arr);
  }
  return map;
}

export type SaveNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'tags'> & {
  id?: number;
  tags?: string[];
};

export async function saveNote(note: SaveNoteInput): Promise<Note> {
  try {
    const db = await getNotesDB();
    const now = new Date().toISOString();
    const tags = normalizeTags(note.tags);

    if (note.id) {
      await db.runAsync(
        'UPDATE notes SET title = ?, content = ?, type = ?, analysis_id = ?, analysis_name = ?, updated_at = ? WHERE id = ?;',
        [note.title, note.content, note.type, note.analysisId ?? null, note.analysisName ?? null, now, note.id]
      );
      if (typeof note.id === 'number') {
        await setNoteTags(db, note.id, tags);
      }
      const updatedNote = await getNoteById(note.id);
      if (!updatedNote) throw new Error('Falha ao encontrar a nota após a atualização.');
      return updatedNote;
    } else {
      const result = await db.runAsync(
        'INSERT INTO notes (title, content, type, analysis_id, analysis_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [note.title, note.content, note.type, note.analysisId ?? null, note.analysisName ?? null, now, now]
      );
      const newId = result.lastInsertRowId as number;
      await setNoteTags(db, newId, tags);
      return {
        ...note,
        id: newId,
        createdAt: now,
        updatedAt: now,
        tags,
      };
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
    const baseNotes = rows.map(mapRowToNoteBase);
    const idList = baseNotes.map((n) => n.id);
    const tagsMap = await getTagsForNoteIds(db, idList);
    return baseNotes.map((n) => ({ ...n, tags: tagsMap.get(n.id) ?? [] }));
  } catch (error) {
    handleError(error, 'notesStorage:getAllNotes');
    throw error;
  }
}

export async function getNoteById(id: number): Promise<Note | null> {
  try {
    const db = await getNotesDB();
    const row = await db.getFirstAsync<NoteDatabaseRow>('SELECT * FROM notes WHERE id = ?;', [id]);
    if (!row) return null;
    const base = mapRowToNoteBase(row);
    const tagsMap = await getTagsForNoteIds(db, [id]);
    return { ...base, tags: tagsMap.get(id) ?? [] };
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
