import { handleError } from '@/services/errorHandler';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';


export interface CalibrationCurve {
  id: number;
  name: string;
  slope: number;
  intercept: number;
  rSquared: number;
  createdAt: string;
}

interface CurveDatabaseRow {
  id: number;
  name: string;
  slope: number;
  intercept: number;
  r_squared: number;
  created_at: string;
}


const DB_NAME = 'calibrations.db';
let dbInstance: SQLiteDatabase | null = null;

async function getDB(): Promise<SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  try {
    dbInstance = await openDatabaseAsync(DB_NAME);
    await dbInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS calibration_curves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slope REAL NOT NULL,
        intercept REAL NOT NULL,
        r_squared REAL NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    return dbInstance;
  } catch (error) {
    handleError(error, 'calibrationStorage:getDB');
    throw new Error("Não foi possível inicializar a base de dados de calibrações.");
  }
}


const mapRowToCurve = (row: CurveDatabaseRow): CalibrationCurve => ({
  id: row.id,
  name: row.name,
  slope: row.slope,
  intercept: row.intercept,
  rSquared: row.r_squared,
  createdAt: row.created_at,
});

export async function saveCurve(curve: Omit<CalibrationCurve, 'id' | 'createdAt'>): Promise<CalibrationCurve> {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO calibration_curves (name, slope, intercept, r_squared, created_at) VALUES (?, ?, ?, ?, ?);',
      [curve.name, curve.slope, curve.intercept, curve.rSquared, now]
    );
    return { ...curve, id: result.lastInsertRowId, createdAt: now };
  } catch (error) {
    handleError(error, 'calibrationStorage:saveCurve', { curveData: curve });
    throw error;
  }
}

export async function getAllCurves(): Promise<CalibrationCurve[]> {
  try {
    const db = await getDB();
    const rows = await db.getAllAsync<CurveDatabaseRow>('SELECT * FROM calibration_curves ORDER BY created_at DESC;');
    return rows.map(mapRowToCurve);
  } catch (error) {
    handleError(error, 'calibrationStorage:getAllCurves');
    throw error;
  }
}

export async function deleteCurve(id: number): Promise<void> {
    try {
        const db = await getDB();
        await db.runAsync('DELETE FROM calibration_curves WHERE id = ?;', [id]);
    } catch (error) {
        handleError(error, 'calibrationStorage:deleteCurve', { curveId: id });
        throw error;
    }
}
