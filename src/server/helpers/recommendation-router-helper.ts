import { z } from "zod";

export const getRecommendationByIdSchema = z.object({
  id: z.string(),
});

export const createRecommendationSchema = z.object({
  songsIds: z.array(z.string()),
  moviesIds: z.nullable(z.array(z.number())),
});

export const updateRecommendationSchema = z.object({
  id: z.string(),
  moviesIds: z.array(z.number()),
});
