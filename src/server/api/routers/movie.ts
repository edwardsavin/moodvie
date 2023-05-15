import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const movieRouter = createTRPCRouter({
  getMovieById: privateProcedure
    .input(z.object({ tmdbId: z.nullable(z.number()) }))
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
    .input(
      z.object({
        movie: z.object({
          tmdbId: z.number(),
          title: z.string(),
          year: z.nullable(z.number()),
          cover: z.nullable(z.string()),
          overview: z.nullable(z.string()),
          vote_average: z.nullable(z.number()),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const movie = await prisma.movie.upsert({
        where: { tmdbId: input.movie.tmdbId },
        create: {
          tmdbId: input.movie.tmdbId,
          title: input.movie.title,
          year: input.movie.year,
          cover: input.movie.cover,
          overview: input.movie.overview,
          vote_average: input.movie.vote_average,
        },
        update: {},
      });
      return movie;
    }),

  createMany: privateProcedure
    .input(
      z.object({
        movies: z.array(
          z.object({
            tmdbId: z.number(),
            title: z.string(),
            year: z.nullable(z.number()),
            cover: z.nullable(z.string()),
            overview: z.nullable(z.string()),
            vote_average: z.nullable(z.number()),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const movies = await Promise.all(
        input.movies.map(async (movie) => {
          return await prisma.movie.upsert({
            where: { tmdbId: movie.tmdbId },
            create: movie,
            update: {},
          });
        })
      );
      return movies;
    }),
});
