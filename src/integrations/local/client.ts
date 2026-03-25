import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Create data directory if it doesn't exist
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(join(dataDir, 'linkglow.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables based on your schema
export function initializeDatabase() {
  // Users table (simplified auth)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT,
      display_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Profile customization
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile_customization (
      user_id TEXT PRIMARY KEY,
      background_color TEXT DEFAULT '#000000',
      text_color TEXT DEFAULT '#ffffff',
      accent_color TEXT DEFAULT '#3b82f6',
      font_family TEXT DEFAULT 'Inter',
      layout_style TEXT DEFAULT 'default',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Uploaded files
  db.exec(`
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      public_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create uploads directory for local storage
  const uploadsDir = join(dataDir, 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  console.log('Local database initialized successfully');
}

// Auth functions
export function createUser(email: string, username?: string, displayName?: string) {
  const userId = crypto.randomUUID();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, username, display_name)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(userId, email, username || email.split('@')[0], displayName || username || email.split('@')[0]);
  
  // Create profile
  const profileStmt = db.prepare(`
    INSERT INTO profiles (id, user_id, username, email, display_name)
    VALUES (?, ?, ?, ?, ?)
  `);
  profileStmt.run(userId, userId, username || email.split('@')[0], email, displayName || username || email.split('@')[0]);
  
  return { id: userId, email, username: username || email.split('@')[0] };
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as any;
}

// File functions
export function saveUploadedFile(fileData: any) {
  const stmt = db.prepare(`
    INSERT INTO uploaded_files (id, user_id, file_name, original_name, file_size, mime_type, storage_path, public_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    fileData.id,
    fileData.user_id,
    fileData.file_name,
    fileData.original_name,
    fileData.file_size,
    fileData.mime_type,
    fileData.storage_path,
    fileData.public_url
  );
}

export function getUserFiles(userId: string) {
  const stmt = db.prepare('SELECT * FROM uploaded_files WHERE user_id = ? ORDER BY created_at DESC');
  return stmt.all(userId) as any[];
}

export function deleteFile(fileId: string, userId: string) {
  const stmt = db.prepare('DELETE FROM uploaded_files WHERE id = ? AND user_id = ?');
  return stmt.run(fileId, userId);
}

// Links functions
export function getUserLinks(userId: string) {
  const stmt = db.prepare('SELECT * FROM links WHERE user_id = ? AND is_active = true ORDER BY order_index');
  return stmt.all(userId) as any[];
}

export function createLink(linkData: any) {
  const stmt = db.prepare(`
    INSERT INTO links (id, user_id, title, url, description, icon, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    linkData.id,
    linkData.user_id,
    linkData.title,
    linkData.url,
    linkData.description,
    linkData.icon,
    linkData.order_index || 0
  );
}

export { db };
