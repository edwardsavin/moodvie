import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  createManySongsSchema,
  createSongSchema,
  getSongByIdSchema,
} from "~/server/helpers/song-router-helper";

export const songRouter = createTRPCRouter({
  getSongById: privateProcedure
    .input(getSongByIdSchema)
    .query(async ({ input }) => {
      const song = await prisma.song.findUnique({
        where: { spotifyId: input.spotifyId },
      });
      return song;
    }),

  create: privateProcedure
    .input(createSongSchema)
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
    .input(createManySongsSchema)
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

      await prisma.song.createMany({
        data: uniqueSongs,
        skipDuplicates: true,
      });
      const songs = await prisma.song.findMany({
        where: { spotifyId: { in: uniqueSongs.map((song) => song.spotifyId) } },
      });
      return songs;
    }),
});
