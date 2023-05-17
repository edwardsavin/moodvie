import { z } from "zod";

export const getSongByIdSchema = z.object({
  spotifyId: z.string(),
});

export const createSongSchema = z.object({
  song: z.object({
    spotifyId: z.string(),
    title: z.string(),
    album: z.string(),
    artist: z.string(),
    cover: z.string(),
  }),
});

export const createManySongsSchema = z.object({
  songs: z.array(
    z.object({
      spotifyId: z.string(),
      title: z.string(),
      album: z.string(),
      artist: z.string(),
      cover: z.string(),
    })
  ),
});
