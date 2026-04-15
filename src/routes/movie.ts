import { Router, Request } from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from '../storage/movie';

import { validate } from '../middleware/validate';
import {
  createMovieSchema,
  updateMovieSchema
} from '../schemas/movie.schema';

const router = Router();

router.get('/', (req, res) => {
  const { genre, minRating } = req.query;

  const movies = getAllMovies({
    genre: genre as string,
    minRating: minRating ? Number(minRating) : undefined
  });

  res.json(movies);
});

router.get('/top', (req, res) => {
  const movies = getAllMovies().filter(m => m.rating >= 8);
  res.json(movies);
});

router.get('/:id', (req: Request<{ id: string }>, res) => {
  const movie = getMovieById(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(movie);
});

router.post('/', validate(createMovieSchema), (req, res) => {
  const movie = createMovie(req.body);
  res.status(201).json(movie);
});

router.patch('/:id', validate(updateMovieSchema), (req: Request<{ id: string }>, res)  => {
  const movie = updateMovie(req.params.id, req.body);

  if (!movie) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(movie);
});

router.delete('/:id', (req: Request<{ id: string }>, res) => {
  const success = deleteMovie(req.params.id);

  if (!success) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
});

export default router;