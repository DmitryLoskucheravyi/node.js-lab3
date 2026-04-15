import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  year: z.number().min(1900).max(new Date().getFullYear()),
  genre: z.enum(['action', 'comedy', 'drama', 'horror']),
  rating: z.number().min(0).max(10)
});

export const updateMovieSchema = createMovieSchema.partial();

export type CreateMovieInput = z.infer<typeof createMovieSchema>;

export type Movie = CreateMovieInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};