import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DiaryList from '../components/DiaryList';
import MovieModal from '../components/MovieModal';
import ReviewDetailModal from '../components/ReviewDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Review } from '../types';
import FilterBar from '../components/FilterBar';
import type { SortOption, FilterOption } from '../components/FilterBar';
import { useDiary } from '../hooks/useDiary';

export default function Diary() {
    const { reviews, addReview, updateReview, deleteReview, loading } = useDiary();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [viewingReview, setViewingReview] = useState<Review | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Confirmation dialog state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

    const handleOpenAddModal = () => {
        setEditingReview(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (review: Review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (review: Review) => {
        setViewingReview(review);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(null);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingReview(null);
    };

    // Request delete confirmation
    // Request delete confirmation
    const handleRequestDelete = (id: string) => {
        console.log(`[Diary] Delete requested for id: ${id}`);
        // Open confirmation dialog without closing other modals
        setReviewToDelete(id);
        setIsConfirmOpen(true);
    };

    // Execute the delete after confirmation
    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;

        console.log(`[Diary] Delete confirmed for id: ${reviewToDelete}`);
        setIsConfirmOpen(false);

        try {
            await deleteReview(reviewToDelete);
            console.log(`[Diary] Delete operation completed for id: ${reviewToDelete}`);

            // Close other modals now that delete is confirmed
            setIsModalOpen(false);
            setIsViewModalOpen(false);
            setEditingReview(null);
            setViewingReview(null);
        } catch (err) {
            console.error(`[Diary] Delete operation failed for id: ${reviewToDelete}:`, err);
            alert('Failed to delete review. Please try again.');
        } finally {
            setReviewToDelete(null);
        }
    };

    // Cancel the delete
    const handleCancelDelete = () => {
        console.log(`[Diary] Delete cancelled for id: ${reviewToDelete}`);
        setIsConfirmOpen(false);
        setReviewToDelete(null);
    };




    // Filter & Sort State
    const [sort, setSort] = useState<SortOption>('date-desc');
    const [filter, setFilter] = useState<FilterOption>('all');
    const [search, setSearch] = useState('');

    const processedReviews = useMemo(() => {
        let result = [...reviews];

        // Search Filter
        if (search.trim()) {
            const query = search.toLowerCase().trim();
            result = result.filter(r =>
                r.movieTitle.toLowerCase().includes(query) ||
                r.reviewText.toLowerCase().includes(query)
            );
        }

        // Category Filter
        if (filter === 'liked') {
            result = result.filter(r => r.liked);
        } else if (filter === '5-star') {
            result = result.filter(r => r.rating === 5);
        }

        // Sort
        result.sort((a, b) => {
            switch (sort) {
                case 'date-desc':
                    return new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime();
                case 'date-asc':
                    return new Date(a.watchedDate).getTime() - new Date(b.watchedDate).getTime();
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'rating-asc':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        return result;
    }, [reviews, sort, filter, search]);

    return (
        <div className="container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '1rem'
            }}>
                <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>Betterboxd</h1>
                <button
                    onClick={handleOpenAddModal}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: 'var(--color-accent-green)',
                        borderRadius: '50%',
                        color: '#000'
                    }}
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
            </header>

            <main>
                <FilterBar
                    sort={sort}
                    setSort={setSort}
                    filter={filter}
                    setFilter={setFilter}
                    search={search}
                    setSearch={setSearch}
                />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading...</div>
                ) : (
                    <DiaryList
                        reviews={processedReviews}
                        onEdit={handleOpenEditModal}
                        onView={handleOpenViewModal}
                    />
                )}
            </main>

            <MovieModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddReview={addReview}
                onUpdateReview={updateReview}
                onDeleteReview={handleRequestDelete}
                initialReview={editingReview}
            />

            <ReviewDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                onEdit={handleOpenEditModal}
                onDelete={(review) => handleRequestDelete(review.id)}
                review={viewingReview}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Delete Review"
                message="Are you sure you want to delete this review? You can recover it later if needed."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                danger={true}
            />
        </div>
    );
}

