import { useState, useEffect } from 'react';
import * as api from '../services/api';
import type { Review } from '../types';

export const useDiary = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews on mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await api.getAllReviews();
                setReviews(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load Betterboxd.");
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
        try {
            const newReview = await api.createReview(review);
            setReviews(prev => [newReview, ...prev]);
        } catch (err) {
            console.error("Error adding review:", err);
            throw err;
        }
    };

    const updateReview = async (id: string, updates: Partial<Review>) => {
        try {
            const updatedReview = await api.updateReview(id, updates);
            setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
        } catch (err) {
            console.error("Error updating review:", err);
            throw err;
        }
    };

    const deleteReview = async (id: string) => {
        console.log(`[useDiary] Deleting review with id: ${id}`);
        try {
            await api.deleteReview(id);
            setReviews(prev => prev.filter(r => r.id !== id));
            console.log(`[useDiary] Successfully deleted review with id: ${id}`);
        } catch (err) {
            console.error(`[useDiary] Error deleting review with id: ${id}:`, err);
            throw err;
        }
    };


    return { reviews, loading, error, addReview, updateReview, deleteReview };
};


