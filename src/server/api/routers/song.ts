import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const songRouter = createTRPCRouter({
  getSongById: privateProcedure
    .input(z.object({ spotifyId: z.string() }))
    .query(async ({ input }) => {
      const song = await prisma.song.findUnique({
        where: { spotifyId: input.spotifyId },
      });
      return song;
    }),

  create: privateProcedure
    .input(
      z.object({
        song: z.object({
          spotifyId: z.string(),
          title: z.string(),
          album: z.string(),
          artist: z.string(),
          cover: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const song = await prisma.song.create({
        data: {
          spotifyId: input.song.spotifyId,
          title: input.song.title,
          album: input.song.album,
          artist: input.song.artist,
          cover: input.song.cover,
        },
      });
      return song;
    }),

  createMany: privateProcedure
    .input(
      z.object({
        songs: z.array(
          z.object({
            spotifyId: z.string(),
            title: z.string(),
            album: z.string(),
            artist: z.string(),
            cover: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const songs = await prisma.song.createMany({
        data: input.songs,
      });
      return songs;
    }),
});
