import type { Movie } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    if (!API_KEY) {
        console.error("TMDB API Key is missing");
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data.results.map((item: any) => ({
            id: item.id,
            title: item.title,
            posterPath: item.poster_path, // Can be null
            releaseDate: item.release_date
        }));
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const getMovieCredits = async (movieId: number): Promise<{ director: string, cast: string }> => {
    if (!API_KEY) return { director: '', cast: '' };

    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );

        if (!response.ok) return { director: '', cast: '' };

        const data = await response.json();

        const directorEntry = data.crew.find((member: any) => member.job === 'Director');
        const director = directorEntry ? directorEntry.name : '';

        const cast = data.cast
            .slice(0, 5)
            .map((member: any) => member.name)
            .join(', ');

        return { director, cast };
    } catch (error) {
        console.error("Error fetching credits:", error);
        return { director: '', cast: '' };
    }
};

