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
      const song = await prisma.song.upsert({
        where: { spotifyId: input.song.spotifyId },
        create: {
          spotifyId: input.song.spotifyId,
          title: input.song.title,
          album: input.song.album,
          artist: input.song.artist,
          cover: input.song.cover,
        },
        update: {},
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
      // Remove duplicates based on spotifyId
      const uniqueSongsMap = input.songs.reduce((map, song) => {
        if (!map.has(song.spotifyId)) {
          map.set(song.spotifyId, song);
        }
        return map;
      }, new Map());

      const uniqueSongs = Array.from(
        uniqueSongsMap.values()
      ) as typeof input.songs;

      const songs = await Promise.all(
        uniqueSongs.map(async (song) => {
          return await prisma.song.upsert({
            where: { spotifyId: song.spotifyId },
            create: song,
            update: {},
          });
        })
      );
      return songs;
    }),
});
