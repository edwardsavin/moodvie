import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  createRecommendationSchema,
  getRecommendationByIdSchema,
  updateRecommendationSchema,
} from "~/server/helpers/recommendation-router-helper";

export const recommendationRouter = createTRPCRouter({
  getAllByUserId: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const recommendations = await prisma.recommendation.findMany({
      where: { userId, movies: { some: {} } },
      include: { songs: true, movies: true },
      take: 7,
      orderBy: { createdAt: "desc" },
    });
    return recommendations;
  }),

  getRecommendationById: privateProcedure
    .input(getRecommendationByIdSchema)
    .query(async ({ input }) => {
      const recommendation = await prisma.recommendation.findUnique({
        where: { id: input.id },
      });
      return recommendation;
    }),

  create: privateProcedure
    .input(createRecommendationSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const songs = await prisma.song.findMany({
        where: { spotifyId: { in: input.songsIds } },
      });

      const movies = input.moviesIds
        ? await prisma.movie.findMany({
            where: { tmdbId: { in: input.moviesIds } },
          })
        : [];

      const recommendation = await prisma.recommendation.create({
        data: {
          userId,
          songs: { connect: songs.map((song) => ({ id: song.id })) },
          movies: { connect: movies.map((movie) => ({ id: movie.id })) },
        },
      });

      return recommendation;
    }),

  update: privateProcedure
    .input(updateRecommendationSchema)
    .mutation(async ({ input }) => {
      const movies = await prisma.movie.findMany({
        where: { tmdbId: { in: input.moviesIds } },
      });

      if (movies.length !== input.moviesIds.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Some movies ids are invalid",
        });
      }

      const recommendation = await prisma.recommendation.update({
        where: { id: input.id },
        data: {
          movies: { connect: movies.map((movie) => ({ id: movie.id })) },
        },
      });

      return recommendation;
    }),

  deleteEmpty: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    const deletedRecommendations = await prisma.recommendation.deleteMany({
      where: { userId, movies: { none: {} } },
    });
    return deletedRecommendations;
  }),
});
