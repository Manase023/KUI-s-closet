import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function migrate() {
  const dbPath = path.join(process.cwd(), 'data', 'kui.db');
  console.log('Migrating DB at:', dbPath);
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    await db.run('ALTER TABLE store_settings ADD COLUMN whatsapp_number TEXT');
    console.log('Added whatsapp_number column.');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('whatsapp_number column already exists.');
    } else {
      console.error('Migration error:', e.message);
    }
  }

  try {
    await db.run('CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, ip TEXT, user_agent TEXT, timestamp TEXT DEFAULT CURRENT_TIMESTAMP)');
    console.log('Visits table ready.');
  } catch (e) {
    console.error('Visits migration error:', e.message);
  }

  await db.close();
}

migrate();
