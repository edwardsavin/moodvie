import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Use Upstash Redis to handle rate limiting
const handleRateLimiting = async function (
  identifier: string,
  limit: number
): Promise<{
  remainingRequests: number;
  resetTime: number;
  remainingTimeInSeconds: number;
}> {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, "3 m"),
    analytics: true,
  });

  // Limit the number of recommendations based on the user's role
  const result = await ratelimit.limit(identifier);
  const remainingRequests = result.remaining;
  const resetTime = result.reset;
  const currentTime = Date.now();
  const remainingTimeInSeconds = Math.ceil((resetTime - currentTime) / 1000);

  // Show the remaining time in seconds if it's less than 60 seconds, otherwise show the remaining time in minutes
  const remainingTime =
    remainingTimeInSeconds < 60
      ? `${remainingTimeInSeconds} seconds`
      : `${Math.ceil(remainingTimeInSeconds / 60)} minutes`;

  if (!result.success) {
    throw new Error(
      `You have exceeded the rate limit of ${limit} requests per 3 minutes. Please try again in ${remainingTime}.`
    );
  }

  return { remainingRequests, resetTime, remainingTimeInSeconds };
};

export default handleRateLimiting;
