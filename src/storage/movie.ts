import { Movie, CreateMovieInput } from '../schemas/movie.schema';

const storage = new Map<string, Movie>();

export const getAllMovies = (filters?: {
  genre?: string;
  minRating?: number;
}) => {
  let movies = Array.from(storage.values());

  if (filters?.genre) {
    movies = movies.filter(m => m.genre === filters.genre);
  }

  const minRating = filters?.minRating;

  if (minRating !== undefined) {
    movies = movies.filter(m => m.rating >= minRating);
  }

  return movies;
};

export const getMovieById = (id: string) => {
  return storage.get(id);
};

export const createMovie = (data: CreateMovieInput): Movie => {
  const movie: Movie = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  storage.set(movie.id, movie);
  return movie;
};

export const updateMovie = (id: string, data: Partial<CreateMovieInput>) => {
  const movie = storage.get(id);
  if (!movie) return null;

  const updated = {
    ...movie,
    ...data,
    updatedAt: new Date()
  };

  storage.set(id, updated);
  return updated;
};

export const deleteMovie = (id: string) => {
  return storage.delete(id);
};

export const resetStorage = () => {
  storage.clear();
};