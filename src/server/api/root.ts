import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { songRouter } from "./routers/song";
import { movieRouter } from "./routers/movie";
import { recommendationRouter } from "./routers/recommendation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  song: songRouter,
  movie: movieRouter,
  recommendation: recommendationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
