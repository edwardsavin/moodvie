import type { NextApiRequest, NextApiResponse } from "next";

export type MovieInfo = {
  title: string;
  overview: string | undefined;
  poster_path: string | undefined;
  vote_average: number | undefined;
  release_date: string | undefined;
  id: number;
  message?: string;
};

// Fetch movie info from TMDB API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const names = req.query.movieNames as string;
  const years = req.query.movieYears as string;

  // Remove suffix from movie names
  const movieNames = names.split(",").map((name) => {
    return name.replace(" ADDEDSUFFIX", "");
  });
  const movieYears = years.split(",");

  try {
    const moviePromises = movieNames.map(
      async (movieName: string, index: number) => {
        const movieYear = movieYears[index];

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${
            process.env.TMDB_API_KEY as string
          }&language=en-US&query=${movieName}&page=1&include_adult=false&year=${
            movieYear as string
          }`
        );

        return response.json();
      }
    );

    const movieDataList = await Promise.all(moviePromises);

    const movieInfoList: (MovieInfo | { message: string })[] =
      movieDataList.map((data: { results: MovieInfo[] }) => {
        if (data.results.length === 0) {
          return { message: "No result found" };
        }
        return data.results[0] as MovieInfo;
      });

    const filteredMovieInfoList: MovieInfo[] = movieInfoList.filter(
      (item): item is MovieInfo => {
        return !("message" in item);
      }
    );

    res.status(200).json(filteredMovieInfoList);
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
}
