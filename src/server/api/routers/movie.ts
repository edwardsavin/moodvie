import type { Movie } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  createManyMoviesSchema,
  getMovieByIdSchema,
  movieSchema,
  upsertMovie,
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
      const movie = await upsertMovie(prisma, input.movie as Movie);
      return movie;
    }),

  createMany: privateProcedure
    .input(createManyMoviesSchema)
    .mutation(async ({ input }) => {
      const movies = await Promise.all(
        input.movies.map(async (movie) => {
          return await upsertMovie(prisma, movie as Movie);
        })
      );
      return movies;
    }),
});
