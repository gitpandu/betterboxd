import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file will be stored in a data directory
const dbPath = join(__dirname, 'data', 'reviews.db');

// Initialize database
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create reviews table with soft-delete support
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    movieId INTEGER NOT NULL,
    movieTitle TEXT NOT NULL,
    posterPath TEXT NOT NULL,
    releaseDate TEXT,
    director TEXT,
    cast TEXT,
    rating REAL NOT NULL,
    liked INTEGER NOT NULL,
    reviewText TEXT NOT NULL,
    watchedDate TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0
  )
`;

db.exec(createTableSQL);

// Migration: Add 'deleted' column if it doesn't exist (for existing databases)
try {
  const tableInfo = db.prepare("PRAGMA table_info(reviews)").all();

  // Migration for 'deleted' column
  const hasDeletedColumn = tableInfo.some(col => col.name === 'deleted');
  if (!hasDeletedColumn) {
    db.exec('ALTER TABLE reviews ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0');
    console.log('[Database] Migration: Added "deleted" column to reviews table');
  }

  // Migration for 'cast' column
  const hasCastColumn = tableInfo.some(col => col.name === 'cast');
  if (!hasCastColumn) {
    db.exec('ALTER TABLE reviews ADD COLUMN cast TEXT');
    console.log('[Database] Migration: Added "cast" column to reviews table');
  }

  // voteAverage migration removed as feature is reverted
} catch (err) {
  console.error('[Database] Migration error:', err);
}

// Prepared statements for CRUD operations
export const statements = {
  // Only return non-deleted reviews
  getAll: db.prepare('SELECT * FROM reviews WHERE deleted = 0 ORDER BY createdAt DESC'),

  // Only return non-deleted review by ID
  getById: db.prepare('SELECT * FROM reviews WHERE id = ? AND deleted = 0'),

  // Get all deleted reviews (for recovery)
  getDeleted: db.prepare('SELECT * FROM reviews WHERE deleted = 1 ORDER BY createdAt DESC'),

  insert: db.prepare(`
    INSERT INTO reviews (id, movieId, movieTitle, posterPath, releaseDate, director, cast, rating, liked, reviewText, watchedDate, createdAt, deleted)
    VALUES (@id, @movieId, @movieTitle, @posterPath, @releaseDate, @director, @cast, @rating, @liked, @reviewText, @watchedDate, @createdAt, 0)
  `),

  update: db.prepare(`
    UPDATE reviews 
    SET movieId = @movieId,
        movieTitle = @movieTitle,
        posterPath = @posterPath,
        releaseDate = @releaseDate,
        director = @director,
        cast = @cast,
        rating = @rating,
        liked = @liked,
        reviewText = @reviewText,
        watchedDate = @watchedDate
    WHERE id = @id AND deleted = 0
  `),

  // Soft delete: mark as deleted instead of removing
  softDelete: db.prepare('UPDATE reviews SET deleted = 1 WHERE id = ?'),

  // Restore: mark as not deleted
  restore: db.prepare('UPDATE reviews SET deleted = 0 WHERE id = ?'),

  // Hard delete (for permanent removal if needed)
  delete: db.prepare('DELETE FROM reviews WHERE id = ?')
};

// Helper function to convert SQLite row to Review object
export function rowToReview(row) {
  if (!row) return null;
  return {
    ...row,
    liked: Boolean(row.liked) // Convert 0/1 to boolean
  };
}

export default db;
