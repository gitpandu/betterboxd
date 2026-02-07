export interface Movie {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;
    director?: string;
    cast?: string;
}

export interface Review {
    id: string;
    movieId: number;
    movieTitle: string;
    posterPath: string;
    releaseDate?: string; // Storing release date to extract year
    director?: string;
    cast?: string;
    rating: number; // 0.5 to 5.0
    liked: boolean;
    reviewText: string;
    watchedDate: string; // ISO string
    createdAt: number; // Timestamp
}
