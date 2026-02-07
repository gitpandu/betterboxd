import { X, Star, Heart, Edit2, Calendar, Trash2 } from 'lucide-react';
import type { Review } from '../types';

interface ReviewDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (review: Review) => void;
    onDelete: (review: Review) => void;
    review: Review | null;
}


export default function ReviewDetailModal({ isOpen, onClose, onEdit, onDelete, review }: ReviewDetailModalProps) {
    if (!isOpen || !review) return null;

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-accent-green)' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <Star
                        key={i}
                        size={20}
                        fill="var(--color-accent-green)"
                        color="var(--color-accent-green)"
                    />
                ))}
                {hasHalf && <span style={{ fontSize: '1.4rem', fontWeight: 800, marginLeft: '2px', lineHeight: 1 }}>½</span>}
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--color-bg)',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '100dvh',
                borderRadius: '0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Review Details</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('[ReviewDetailModal] Delete icon clicked');
                                onDelete(review);
                            }}
                            style={{
                                color: 'var(--color-text-muted)',
                                background: 'none',
                                border: '1px solid transparent',
                                cursor: 'pointer',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-orange)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                            <Trash2 size={20} />
                        </button>

                        <button
                            onClick={() => {
                                onEdit(review);
                                onClose();
                            }}
                            style={{
                                color: 'var(--color-text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-blue)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                            <Edit2 size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X color="var(--color-text-primary)" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '100px', height: '150px', background: '#333', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                            <img src={`https://image.tmdb.org/t/p/w200${review.posterPath}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{review.movieTitle}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {renderStars(review.rating)}
                                {review.liked && <Heart size={18} fill="var(--color-accent-orange)" color="var(--color-accent-orange)" />}
                            </div>
                            <div style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} />
                                        {review.releaseDate ? review.releaseDate.split('-')[0] : 'Year Unknown'}
                                    </span>
                                    {review.director && (
                                        <>
                                            <span style={{ opacity: 0.3 }}>•</span>
                                            <span>Dir. {review.director}</span>
                                        </>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    Watched {new Date(review.watchedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '1.5rem'
                    }}>
                        {review.reviewText || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No review text provided.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
