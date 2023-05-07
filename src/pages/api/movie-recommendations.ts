import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { songs } = req.body as { songs: string };

  const exampleSongs1 =
    "1. Plain Jane by A$AP Ferg; 2. Strazile feat. (Mario V) by B.U.G. Mafia; 3. Poezie De Strada (Radio Edit) - Remix by B.U.G. Mafia; 4. 40 kmh by B.U.G. Mafia; 5. Dead Inside (Interlude) by XXXTENTACION";
  const exampleSongs2 =
    "1. Gherila PTM by B.U.G. Mafia; 2. Estu' Salbatic by B.U.G. Mafia; 3. Billie Jean by Michael Jackson; 4. The Time (Dirty Bit) by The Black Eyed Peas; 5. Beautiful Liar by Beyoncé";
  const exampleSongs3 =
    "1. What's Luv? (feat. Ashanti) by Fat Joe; 2. The Crack Attack by Fat Joe; 3. What's Luv? (feat. Ashanti) by Fat Joe; 4. TiK ToK by Kesha; 5. What's Luv? (feat. Ashanti) by Fat Joe";

  const exampleResponse1 =
    "Project X (2012); City of God (2002); Scarface (1983); The Fast and the Furious (2001); Fight Club (1999)";
  const exampleResponse2 =
    "The Godfather (1972); Training Day (2001); Moonwalker (1988); The Hangover (2009); Crazy Rich Asians (2018).";
  const exampleResponse3 =
    "Bad Boys II (2003); Carlito's Way (1993); 8 Mile (2002); The Hangover (2009); Love & Basketball (2000)";

  const examplePrompt = `Recommend me 5 movies based on these 5 songs:${exampleSongs1} You should respond in one single line only with the name of the movies (and year in parentheses), separated by a semicolon and a space, nothing else. Please ensure that your recommendations include only movies and not TV shows.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that recommends movies based on songs. Please ensure that your recommendations include only movies and not TV shows. Answer as concisely as possible. Always answer only with 5 movies, nothing else.",
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
          content: songs,
        },
      ],
      temperature: 0.5,
      max_tokens: 101,
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
        message:
          "There was a problem trying to get your recommendations, please try again",
      });
    } else {
      const movieRecommendations = movieRecommendationsString
        .split("; ")
        .map((movie) => movie.trim().replace(/\.$/, ""));
      res.status(200).json({ movieRecommendations });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
}
