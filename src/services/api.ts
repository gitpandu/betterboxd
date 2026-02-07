const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

import type { Review } from '../types';

// Fetch all reviews
export async function getAllReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/api/reviews`);
    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return response.json();
}

// Get single review by ID
export async function getReviewById(id: string): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch review');
    }
    return response.json();
}

// Create new review
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        throw new Error('Failed to create review');
    }

    return response.json();
}

// Update existing review
export async function updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update review');
    }

    return response.json();
}

// Delete review
export async function deleteReview(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete review');
    }
}
