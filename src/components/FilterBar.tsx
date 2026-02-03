import { ArrowUpDown, Search } from 'lucide-react';

export type SortOption = 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc';
export type FilterOption = 'all' | 'liked' | '5-star';

interface FilterBarProps {
    sort: SortOption;
    setSort: (s: SortOption) => void;
    filter: FilterOption;
    setFilter: (f: FilterOption) => void;
    search: string;
    setSearch: (s: string) => void;
}

export default function FilterBar({ sort, setSort, filter, setFilter, search, setSearch }: FilterBarProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {/* Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-bg-input)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--color-border)'
            }}>
                <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
                <input
                    type="text"
                    placeholder="Search Betterboxd..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                alignItems: 'center'
            }}>
                {/* Sort Select */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <ArrowUpDown size={14} color="var(--color-text-muted)" style={{ position: 'absolute', left: '8px', zIndex: 1 }} />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        style={{
                            appearance: 'none',
                            background: 'var(--color-bg-input)',
                            border: 'none',
                            color: 'var(--color-text-primary)',
                            padding: '0.5rem 0.5rem 0.5rem 2rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="rating-desc">Highest Rated</option>
                        <option value="rating-asc">Lowest Rated</option>
                    </select>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            background: filter === 'all' ? 'var(--color-text-primary)' : 'transparent',
                            color: filter === 'all' ? 'var(--color-bg)' : 'var(--color-text-muted)',
                            border: filter === 'all' ? 'none' : '1px solid var(--color-border)',
                            fontWeight: 600
                        }}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('liked')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            background: filter === 'liked' ? 'var(--color-accent-orange)' : 'transparent',
                            color: filter === 'liked' ? 'white' : 'var(--color-text-muted)',
                            border: filter === 'liked' ? 'none' : '1px solid var(--color-border)',
                            fontWeight: 600
                        }}
                    >
                        Liked
                    </button>
                    <button
                        onClick={() => setFilter('5-star')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            background: filter === '5-star' ? 'var(--color-accent-green)' : 'transparent',
                            color: filter === '5-star' ? 'black' : 'var(--color-text-muted)',
                            border: filter === '5-star' ? 'none' : '1px solid var(--color-border)',
                            fontWeight: 600
                        }}
                    >
                        5 Stars
                    </button>
                </div>
            </div>
        </div>
    );
}
