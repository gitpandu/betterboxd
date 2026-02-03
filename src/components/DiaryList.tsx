import type { Review } from '../types';
import MovieCard from './MovieCard';

interface DiaryListProps {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onView: (review: Review) => void;
}

export default function DiaryList({ reviews, onEdit, onView }: DiaryListProps) {
    if (reviews.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No movies logged yet.
            </div>
        );
    }

    // Grouping logic
    const grouped = reviews.reduce((acc: { [key: string]: Review[] }, review) => {
        const date = new Date(review.watchedDate);
        const key = `${date.toLocaleString('default', { month: 'long' }).toUpperCase()} ${date.getFullYear()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(review);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
            {Object.entries(grouped).map(([month, monthReviews]) => (
                <div key={month} style={{ marginBottom: '1rem' }}>
                    <div style={{
                        padding: '4px 12px',
                        background: '#1e2328',
                        color: '#8996a2',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        borderTop: '1px solid #2c3440',
                        borderBottom: '1px solid #2c3440',
                        margin: '0 -1rem' // Pull out to full width if container has padding
                    }}>
                        {month}
                    </div>
                    <div style={{ padding: '0 4px' }}>
                        {monthReviews.map((review) => (
                            <MovieCard key={review.id} review={review} onEdit={onEdit} onView={onView} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
