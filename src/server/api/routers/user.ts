import { Redis } from "@upstash/redis";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId as string;
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    return user;
  }),

  // Cache the user's role in Redis
  setRoleInRedis: publicProcedure.mutation(async ({ ctx }) => {
    const redis = Redis.fromEnv();
    const ttlInSeconds = 900;

    const userId = ctx.userId as string;
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    const role = user?.role;

    await redis.set(userId, role);
    await redis.expire(userId, ttlInSeconds);

    return;
  }),
});
