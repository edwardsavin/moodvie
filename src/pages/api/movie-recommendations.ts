import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { getAuth } from "@clerk/nextjs/server";
import handleRateLimiting from "~/utils/rate-limiter";
import { Redis } from "@upstash/redis";

// Get the user's role from Redis
const getRoleFromCache = async (
  userId: string
): Promise<string | undefined> => {
  const redis = Redis.fromEnv();
  const role = await redis.get(userId);
  return role as string | undefined;
};

// Get the limit based on the user's role
const getLimitByRole = (role: string | undefined): number => {
  if (role === "ADMIN") return 50;
  if (role === "PREMIUM_USER") return 20;
  return 5;
};

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Fetch movie recommendations with OpenAI API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { songs } = req.body as { songs: string };
  const { temperature: currentTemperature } = req.body as {
    temperature: number;
  };

  // Limit the number of recommendations based on the user's role
  const identifier = getAuth(req).userId as string;
  const userRole = await getRoleFromCache(identifier);
  const limit = getLimitByRole(userRole);

  const exampleSongs1 =
    "1. Plain Jane by A$AP Ferg; 2. Strazile feat. (Mario V) by B.U.G. Mafia; 3. Poezie De Strada (Radio Edit) - Remix by B.U.G. Mafia; 4. 40 kmh by B.U.G. Mafia; 5. Dead Inside (Interlude) by XXXTENTACION";
  const exampleSongs2 =
    "1. Gherila PTM by B.U.G. Mafia; 2. Estu' Salbatic by B.U.G. Mafia; 3. Billie Jean by Michael Jackson; 4. The Time (Dirty Bit) by The Black Eyed Peas; 5. Beautiful Liar by Beyoncé";
  const exampleSongs3 =
    "1. What's Luv? (feat. Ashanti) by Fat Joe; 2. The Crack Attack by Fat Joe; 3. What's Luv? (feat. Ashanti) by Fat Joe; 4. TiK ToK by Kesha; 5. What's Luv? (feat. Ashanti) by Fat Joe";
  const exampleSongs4 =
    "1. 01000111 00110010 01000111 00101110 by OmenXIII; 2. NOT ENOUGH MANA by HAARPER; 3. Satanic Panic by Bleed The Wicked Menace; 4. Download My Conscious by Faceless 1-7; 5. Tha Dog Pound by 99zed";

  const exampleResponse1 =
    "Project X (2012); City of God (2002); Scarface (1983); The Fast and the Furious (2001); Fight Club (1999)";
  const exampleResponse2 =
    "The Godfather (1972); Training Day (2001); Moonwalker (1988); The Hangover (2009); Crazy Rich Asians (2018).";
  const exampleResponse3 =
    "Bad Boys II (2003); Carlito's Way (1993); 8 Mile (2002); The Hangover (2009); Love & Basketball (2000)";
  const exampleResponse4 =
    "The Matrix (1999); Jubilee (1978); Rosemary's Baby (1968); Inception (2010); Training Day (2001)";

  const examplePrompt = `Recommend me 5 movies based on these 5 songs:${exampleSongs1} You should respond in one single line only with the name of the movies (and year in parentheses), separated by a semicolon and a space, nothing else. Please ensure that your recommendations include only movies and not TV shows. In case that some songs are not popular enough just recommend movies based on just the name of the songs, they do not have to be accurate. If the names of the songs doesn't help, just recommend random movies.`;

  try {
    const { remainingRequests, resetTime, remainingTimeInSeconds } =
      await handleRateLimiting(identifier, limit);

    // Set the rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remainingRequests);
    res.setHeader("X-RateLimit-Reset", resetTime);
    res.setHeader("X-RateLimit-RemainingTime", remainingTimeInSeconds);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that recommends movies based on songs. Please ensure that your recommendations include only movies and not TV shows. Answer as concisely as possible. Always answer only with 5 movies, nothing else. In case that some songs are not popular enough just recommend movies based on just the name of the songs, they do not have to be accurate. If the names of the songs doesn't help, just recommend random movies.",
        },
        {
          role: "user",
          content: examplePrompt,
        },
        {
          role: "assistant",
          content: exampleResponse1,
        },
        {
          role: "user",
          content: exampleSongs2,
        },
        {
          role: "assistant",
          content: exampleResponse2,
        },
        {
          role: "user",
          content: exampleSongs3,
        },
        {
          role: "assistant",
          content: exampleResponse3,
        },
        {
          role: "user",
          content: exampleSongs4,
        },
        {
          role: "assistant",
          content: exampleResponse4,
        },
        {
          role: "user",
          content: songs,
        },
      ],
      temperature: currentTemperature,
      max_tokens: 1001,
    });

    if (!response.data.choices[0]?.message)
      return res.status(500).json({
        message:
          "There was a problem trying to get your recommendations, please try again",
      });

    const movieRecommendationsString =
      response.data.choices[0].message.content.trim();

    if (!movieRecommendationsString.includes(";")) {
      res.status(500).json({
        message: response.data.choices[0].message.content.trim(),
      });
    } else {
      // Check if the recommendation has a valid year at the end
      // This is to filter out TV shows recommendations for example (ex: "Game of Thrones (2011-2019)")
      function checkIfYearValid(recommendation: string): boolean {
        const yearPattern = /\(\d{4}\)/;
        return yearPattern.test(recommendation);
      }

      const movieRecommendations = movieRecommendationsString
        .split("; ")
        .map((movie) => movie.trim().replace(/\.$/, ""))
        .filter(checkIfYearValid);
      res.status(200).json({ movieRecommendations });
    }
  } catch (error: unknown) {
    // Catch the error message from handleRateLimiting
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({
        message:
          "There was a problem processing your request. Please try again later.",
      });
    }
  }
}
