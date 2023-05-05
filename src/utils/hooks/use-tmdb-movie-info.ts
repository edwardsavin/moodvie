import useSWR from "swr";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import { fetchMovieInfo } from "../fetchers";

// Fetches movie info from TMDB API
const useTmdbMovieInfo = (movieTitle: string, movieYear: string) => {
  const { data, error } = useSWR<MovieInfo>(
    movieTitle && movieYear
      ? [
          `/api/tmdb-fetch-movie-info?movieName=${movieTitle}&movieYear=${movieYear}`,
        ]
      : null,
    fetchMovieInfo
  ) as { data: MovieInfo | undefined; error: Error };

  if (error) {
    throw error;
  }

  return data;
};

export default useTmdbMovieInfo;
