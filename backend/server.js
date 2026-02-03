import express from 'express';
import cors from 'cors';
import { statements, rowToReview } from './database.js';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
try {
    mkdirSync(dataDir, { recursive: true });
} catch (err) {
    // Directory already exists
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
    try {
        const rows = statements.getAll.all();
        const reviews = rows.map(rowToReview);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get single review by ID
app.get('/api/reviews/:id', (req, res) => {
    try {
        const row = statements.getById.get(req.params.id);
        if (!row) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(rowToReview(row));
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ error: 'Failed to fetch review' });
    }
});

// Create new review
app.post('/api/reviews', (req, res) => {
    try {
        const { movieId, movieTitle, posterPath, releaseDate, director, rating, liked, reviewText, watchedDate } = req.body;

        // Validation
        if (!movieId || !movieTitle || !posterPath || rating === undefined || liked === undefined || !reviewText || !watchedDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const review = {
            id: randomUUID(),
            movieId,
            movieTitle,
            posterPath,
            releaseDate: releaseDate || null,
            director: director || null,
            rating,
            liked: liked ? 1 : 0, // Convert boolean to integer
            reviewText,
            watchedDate,
            createdAt: Date.now()
        };

        statements.insert.run(review);

        // Return the created review with boolean liked
        res.status(201).json({ ...review, liked: Boolean(review.liked) });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// Update review
app.put('/api/reviews/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { movieId, movieTitle, posterPath, releaseDate, director, rating, liked, reviewText, watchedDate } = req.body;

        // Check if review exists
        const existing = statements.getById.get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const updates = {
            id,
            movieId: movieId !== undefined ? movieId : existing.movieId,
            movieTitle: movieTitle !== undefined ? movieTitle : existing.movieTitle,
            posterPath: posterPath !== undefined ? posterPath : existing.posterPath,
            releaseDate: releaseDate !== undefined ? releaseDate : existing.releaseDate,
            director: director !== undefined ? director : existing.director,
            rating: rating !== undefined ? rating : existing.rating,
            liked: liked !== undefined ? (liked ? 1 : 0) : existing.liked,
            reviewText: reviewText !== undefined ? reviewText : existing.reviewText,
            watchedDate: watchedDate !== undefined ? watchedDate : existing.watchedDate
        };

        statements.update.run(updates);

        // Fetch and return updated review
        const updated = statements.getById.get(id);
        res.json(rowToReview(updated));
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// Delete review
app.delete('/api/reviews/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Check if review exists
        const existing = statements.getById.get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Review not found' });
        }

        statements.delete.run(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/reviews`);
});
