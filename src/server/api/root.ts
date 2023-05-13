import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { songRouter } from "./routers/song";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  song: songRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
