import useSWR from "swr";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import { fetchMovieInfo } from "../fetchers";

// Fetches movie info from TMDB API
const useTmdbMovieInfo = (movieNames: string[], movieYears: string[]) => {
  // Add suffix to movie names
  const suffixNames = movieNames.map((movieName) => {
    return `${movieName} ADDEDSUFFIX`;
  });

  const { data, error } = useSWR<MovieInfo[]>(
    movieNames && movieYears
      ? ["/api/tmdb-fetch-movie-info", suffixNames, movieYears]
      : null,
    fetchMovieInfo
  ) as { data: MovieInfo | undefined; error: Error };

  if (error) {
    throw error;
  }

  return data;
};

export default useTmdbMovieInfo;
