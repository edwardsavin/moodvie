import MovieCard from "./movie-card";
import useTmdbMovieInfo from "~/utils/hooks/use-tmdb-movie-info";
import { forwardRef, useEffect } from "react";
import { api } from "~/utils/api";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import type { Movie } from "./movie-recommendations-button";

type MovieRecommendationsProps = {
  movies: Movie[];
  recommendationId: string;
};

// Render all aggregated movie recommendations
export const MovieRecommendations = forwardRef(
  ({ movies, recommendationId }: MovieRecommendationsProps, ref) => {
    const moviesInfo = useTmdbMovieInfo(
      movies.map((movie) => movie.title),
      movies.map((movie) => movie.year)
    ) as unknown as MovieInfo[];

    const { mutate: mutateMovies } = api.movie.createMany.useMutation();
    const { mutate: mutateRecommendation } =
      api.recommendation.update.useMutation();
    const { mutate: mutateDeleteEmptyRecommendations } =
      api.recommendation.deleteEmpty.useMutation();

    // Create the movies in the database when the movie info is fetched
    useEffect(() => {
      if (!moviesInfo) return;

      const moviesToCreate = moviesInfo.map((movieInfo: MovieInfo) => {
        // If the movie has a poster, use it. Otherwise, use a placeholder
        let movieCover = null;
        if (movieInfo.poster_path) {
          movieCover = `https://image.tmdb.org/t/p/original/${movieInfo.poster_path}`;
        } else {
          movieCover = `https://via.placeholder.com/200x300?text=${movieInfo.title}`;
        }

        let movieYear = null;
        if (movieInfo.release_date) {
          movieYear = parseInt(movieInfo.release_date.split("-")[0] as string);
        }

        return {
          title: movieInfo.title,
          cover: movieCover,
          tmdbId: movieInfo.id,
          year: movieYear,
          overview: movieInfo.overview ?? null,
          vote_average: movieInfo.vote_average ?? null,
        };
      });

      mutateMovies(
        {
          movies: moviesToCreate,
        },
        {
          onSettled: () => {
            mutateRecommendation(
              {
                id: recommendationId,
                moviesIds: moviesToCreate.map((movie) => movie.tmdbId),
              },
              {
                onSettled: () => {
                  mutateDeleteEmptyRecommendations();
                },
              }
            );
          },
        }
      );
    }, [
      moviesInfo,
      mutateMovies,
      mutateRecommendation,
      mutateDeleteEmptyRecommendations,
      recommendationId,
    ]);

    return (
      <div
        className="mt-8 flex flex-col"
        ref={ref as React.MutableRefObject<HTMLDivElement>}
      >
        <div className="m:grid-cols-2 mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5">
          {moviesInfo?.map((movieInfo: MovieInfo) => (
            <MovieCard key={movieInfo.id} movieInfo={movieInfo} />
          ))}
        </div>
      </div>
    );
  }
);

MovieRecommendations.displayName = "MovieRecommendations";

export default MovieRecommendations;
