import type { Movie, PrismaClient } from "@prisma/client";
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

export const upsertMovie = async (
  prisma: PrismaClient,
  movie: Movie
): Promise<Movie> => {
  return await prisma.movie.upsert({
    where: { tmdbId: movie.tmdbId },
    create: movie,
    update: {},
  });
};
