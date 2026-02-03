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

// Create reviews table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    movieId INTEGER NOT NULL,
    movieTitle TEXT NOT NULL,
    posterPath TEXT NOT NULL,
    releaseDate TEXT,
    director TEXT,
    rating REAL NOT NULL,
    liked INTEGER NOT NULL,
    reviewText TEXT NOT NULL,
    watchedDate TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  )
`;

db.exec(createTableSQL);

// Prepared statements for CRUD operations
export const statements = {
    getAll: db.prepare('SELECT * FROM reviews ORDER BY createdAt DESC'),

    getById: db.prepare('SELECT * FROM reviews WHERE id = ?'),

    insert: db.prepare(`
    INSERT INTO reviews (id, movieId, movieTitle, posterPath, releaseDate, director, rating, liked, reviewText, watchedDate, createdAt)
    VALUES (@id, @movieId, @movieTitle, @posterPath, @releaseDate, @director, @rating, @liked, @reviewText, @watchedDate, @createdAt)
  `),

    update: db.prepare(`
    UPDATE reviews 
    SET movieId = @movieId,
        movieTitle = @movieTitle,
        posterPath = @posterPath,
        releaseDate = @releaseDate,
        director = @director,
        rating = @rating,
        liked = @liked,
        reviewText = @reviewText,
        watchedDate = @watchedDate
    WHERE id = @id
  `),

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
