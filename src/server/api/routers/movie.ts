import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  createManyMoviesSchema,
  getMovieByIdSchema,
  movieSchema,
} from "~/server/helpers/movie-router-helper";

export const movieRouter = createTRPCRouter({
  getMovieById: privateProcedure
    .input(getMovieByIdSchema)
    .query(async ({ input }) => {
      if (!input.tmdbId) {
        return null;
      }

      const movie = await prisma.movie.findUnique({
        where: { tmdbId: input.tmdbId },
      });
      return movie;
    }),

  create: privateProcedure
    .input(z.object({ movie: movieSchema }))
    .mutation(async ({ input }) => {
      const movie = await prisma.movie.upsert({
        where: { tmdbId: input.movie.tmdbId },
        create: input.movie,
        update: {},
      });
      return movie;
    }),

  createMany: privateProcedure
    .input(createManyMoviesSchema)
    .mutation(async ({ input }) => {
      await prisma.movie.createMany({
        data: input.movies,
        skipDuplicates: true,
      });
      const movies = await prisma.movie.findMany({
        where: { tmdbId: { in: input.movies.map((movie) => movie.tmdbId) } },
      });
      return movies;
    }),
});
