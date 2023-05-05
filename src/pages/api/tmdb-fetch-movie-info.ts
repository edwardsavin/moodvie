import type { NextApiRequest, NextApiResponse } from "next";

export type MovieInfo = {
  title: string;
  overview: string | undefined;
  poster_path: string | undefined;
  vote_average: number | undefined;
  release_date: string | undefined;
};

// Fetch movie info from TMDB API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const movieName = req.query.movieName as string;
  const movieYear = req.query.movieYear as string;

  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.TMDB_API_KEY as string
      }&language=en-US&query=${movieName}&page=1&include_adult=false&year=${movieYear}`
    );

    const data = (await result.json()) as { results: MovieInfo[] };
    const movieInfo = data.results[0];

    if (movieInfo) {
      res.status(200).json(movieInfo);
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
}
