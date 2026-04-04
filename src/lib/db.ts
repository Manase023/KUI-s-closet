import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  db = await open({
    filename: path.join(process.cwd(), 'data', 'kui.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA journal_mode = WAL;');

  return db;
}
