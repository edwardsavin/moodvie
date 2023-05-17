import { z } from "zod";

export const movieSchema = z.object({
  tmdbId: z.number(),
  title: z.string(),
  year: z.nullable(z.number()),
  cover: z.nullable(z.string()),
  overview: z.nullable(z.string()),
  vote_average: z.nullable(z.number()),
});

export const getMovieByIdSchema = z.object({
  tmdbId: z.nullable(z.number()),
});

export const createManyMoviesSchema = z.object({
  movies: z.array(movieSchema),
});
