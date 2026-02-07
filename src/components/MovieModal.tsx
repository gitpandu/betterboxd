import { useState, useEffect } from 'react';
import { X, Search, Star, Heart, Trash2 } from 'lucide-react';
import { searchMovies, getMovieDirector } from '../services/tmdb';
import type { Movie, Review } from '../types';

interface MovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddReview: (review: any) => void;
    onUpdateReview: (id: string, review: any) => void;
    onDeleteReview?: (id: string) => void;
    initialReview?: Review | null;
}

export default function MovieModal({ isOpen, onClose, onAddReview, onUpdateReview, onDeleteReview, initialReview }: MovieModalProps) {
    const [step, setStep] = useState<'search' | 'review'>(initialReview ? 'review' : 'search');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(initialReview ? {
        id: initialReview.movieId,
        title: initialReview.movieTitle,
        posterPath: initialReview.posterPath,
        releaseDate: initialReview.releaseDate || '',
        director: initialReview.director
    } : null);

    // Review State
    const [rating, setRating] = useState(initialReview?.rating || 0);
    const [liked, setLiked] = useState(initialReview?.liked || false);
    const [reviewText, setReviewText] = useState(initialReview?.reviewText || '');
    const [watchedDate, setWatchedDate] = useState(initialReview?.watchedDate || new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (initialReview) {
            setStep('review');
            setSelectedMovie({
                id: initialReview.movieId,
                title: initialReview.movieTitle,
                posterPath: initialReview.posterPath,
                releaseDate: initialReview.releaseDate || '',
                director: initialReview.director
            });
            setRating(initialReview.rating);
            setLiked(initialReview.liked);
            setReviewText(initialReview.reviewText);
            setWatchedDate(initialReview.watchedDate);
        } else {
            setStep('search');
            setSelectedMovie(null);
            setRating(0);
            setLiked(false);
            setReviewText('');
            setWatchedDate(new Date().toISOString().split('T')[0]);
        }
    }, [initialReview]);

    useEffect(() => {
        if (query.length > 2) {
            const delayDebounceFn = setTimeout(async () => {
                const movies = await searchMovies(query);
                setResults(movies);
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSelectMovie = async (movie: Movie) => {
        const director = await getMovieDirector(movie.id);
        setSelectedMovie({ ...movie, director });
        setStep('review');
    };

    const handleSubmit = () => {
        if (!selectedMovie) return;

        const reviewData = {
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            posterPath: selectedMovie.posterPath,
            releaseDate: selectedMovie.releaseDate,
            director: selectedMovie.director,
            rating,
            liked,
            reviewText,
            watchedDate
        };

        if (initialReview) {
            onUpdateReview(initialReview.id, reviewData);
        } else {
            onAddReview(reviewData);
        }

        // Reset and close
        onCloseInternal();
    };


    const onCloseInternal = () => {
        setStep('search');
        setQuery('');
        setResults([]);
        setSelectedMovie(null);
        setRating(0);
        setLiked(false);
        setReviewText('');
        onClose();
    };

    if (!isOpen) return null;

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
                width: '95vw',
                maxWidth: '1000px',
                maxHeight: '95vh',
                borderRadius: 'var(--border-radius)',
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
                    <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
                        {initialReview ? 'Edit Review' : (step === 'search' ? 'Log a Movie' : 'I Watched...')}
                    </h2>
                    <button onClick={onCloseInternal}><X color="var(--color-text-primary)" /></button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>

                    {step === 'search' ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--color-bg-input)',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--border-radius)',
                                marginBottom: '1rem'
                            }}>
                                <Search size={18} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
                                <input
                                    type="text"
                                    placeholder="Search film..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        width: '100%',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {results.map((movie) => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleSelectMovie(movie)}
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-card)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ width: '40px', height: '60px', background: '#333', flexShrink: 0 }}>
                                            {movie.posterPath && <img src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{movie.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                {movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        selectedMovie && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '70px', height: '105px', background: '#333', flexShrink: 0 }}>
                                        {selectedMovie.posterPath && <img src={`https://image.tmdb.org/t/p/w200${selectedMovie.posterPath}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedMovie.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                                            <span>{selectedMovie.releaseDate ? selectedMovie.releaseDate.split('-')[0] : 'Year Unknown'}</span>
                                            {selectedMovie.director && (
                                                <>
                                                    <span style={{ opacity: 0.5 }}>|</span>
                                                    <span>Dir. {selectedMovie.director}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specify Date</label>
                                    <input
                                        type="date"
                                        value={watchedDate}
                                        onChange={(e) => setWatchedDate(e.target.value)}
                                        style={{
                                            background: 'var(--color-bg-input)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            width: '100%'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {[1, 2, 3, 4, 5].map((starValue) => {
                                                const isFull = rating >= starValue;
                                                const isHalf = !isFull && rating === starValue - 0.5;

                                                return (
                                                    <div
                                                        key={starValue}
                                                        style={{ cursor: 'pointer', position: 'relative', width: '28px', height: '28px' }}
                                                        onClick={() => {
                                                            if (rating === starValue) {
                                                                setRating(starValue - 0.5);
                                                            } else if (rating === starValue - 0.5) {
                                                                setRating(starValue);
                                                            } else {
                                                                setRating(starValue);
                                                            }
                                                        }}
                                                    >
                                                        {/* Base Star (Empty/Dimmed) */}
                                                        <Star
                                                            size={28}
                                                            fill="none"
                                                            color="var(--color-text-muted)"
                                                            style={{ opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
                                                        />
                                                        {/* Highlighted Star */}
                                                        {(isFull || isHalf) && (
                                                            <Star
                                                                size={28}
                                                                fill="var(--color-accent-green)"
                                                                color="var(--color-accent-green)"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    clipPath: isHalf ? 'inset(0 50% 0 0)' : 'none'
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Like</label>
                                        <Heart
                                            size={24}
                                            fill={liked ? "var(--color-accent-orange)" : "none"}
                                            color={liked ? "var(--color-accent-orange)" : "var(--color-text-muted)"}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setLiked(!liked)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Write a review..."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        rows={15}
                                        style={{
                                            width: '100%',
                                            background: 'var(--color-bg-input)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '1rem',
                                            borderRadius: '4px',
                                            resize: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {initialReview && (
                                        <button
                                            onClick={() => onDeleteReview && onDeleteReview(initialReview.id)}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                color: 'var(--color-text-muted)',
                                                padding: '1rem',
                                                borderRadius: '4px',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                border: '1px solid var(--color-border)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(235, 87, 87, 0.1)';
                                                e.currentTarget.style.color = '#eb5757';
                                                e.currentTarget.style.borderColor = '#eb5757';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.color = 'var(--color-text-muted)';
                                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                            }}
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSubmit}
                                        style={{
                                            flex: 1,
                                            background: 'var(--color-accent-green)',
                                            color: '#050709',
                                            padding: '1rem',
                                            borderRadius: '4px',
                                            fontWeight: 700,
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
