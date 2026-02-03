
import { Star, Heart, Edit2 } from 'lucide-react';
import type { Review } from '../types';

interface MovieCardProps {
    review: Review;
    onEdit: (review: Review) => void;
    onView: (review: Review) => void;
}

export default function MovieCard({ review, onEdit, onView }: MovieCardProps) {
    // Helper to render stars with text-based half-star support
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1px', color: 'var(--color-accent-green)' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill="var(--color-accent-green)"
                        color="var(--color-accent-green)"
                    />
                ))}
                {hasHalf && <span style={{ fontSize: '1rem', fontWeight: 800, marginLeft: '2px', lineHeight: 1 }}>½</span>}
            </div>
        );
    };

    const date = new Date(review.watchedDate);
    const day = date.getDate();

    return (
        <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            padding: '8px 0',
            borderBottom: '1px solid #2c3440',
            background: 'var(--color-bg)',
            alignItems: 'flex-start'
        }}>
            {/* Date Box (Day Number only) */}
            <div style={{
                flexShrink: 0,
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8996a2',
                border: '1px solid #455567',
                borderRadius: '4px',
                background: '#14181c',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginTop: '4px'
            }}>
                {day}
            </div>

            {/* Poster (Smaller) */}
            <div style={{
                flexShrink: 0,
                width: '35px',
                height: '52px',
                borderRadius: '2px',
                overflow: 'hidden',
                background: 'var(--color-bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginTop: '4px'
            }}>
                <img
                    src={`https://image.tmdb.org/t/p/w92${review.posterPath}`}
                    alt={review.movieTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                />
            </div>

            {/* Content Table-style */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                <h3
                    onClick={() => onView(review)}
                    style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.2,
                        cursor: 'pointer',
                        margin: '0 0 4px 0',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '6px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-blue)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                >
                    <span>{review.movieTitle}</span>
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        fontWeight: 400
                    }}>
                        {review.releaseDate ? review.releaseDate.split('-')[0] : ''}
                    </span>
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {renderStars(review.rating)}
                    {review.liked && <Heart size={12} fill="var(--color-accent-orange)" color="var(--color-accent-orange)" />}
                </div>

                {review.reviewText && (
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                        lineHeight: '1.3',
                        whiteSpace: 'pre-wrap',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0,
                        opacity: 0.8
                    }}>
                        {review.reviewText}
                    </p>
                )}
            </div>

            {/* Edit subtle (keeping it for functionality) */}
            <button
                onClick={() => onEdit(review)}
                style={{
                    color: 'rgba(255,255,255,0.1)',
                    padding: '4px',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    marginTop: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.1)'}
            >
                <Edit2 size={14} />
            </button>
        </div>
    );
}

