import Image from "next/image";
import useTmdbMovieInfo from "~/utils/hooks/use-tmdb-movie-info";
import { forwardRef, useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import type { Movie } from "./movie-recommendations-button";

type MovieRecommendationsProps = {
  movies: Movie[];
  recommendationId: string;
};

// Display the movie recommendations modal with a poster, title, release year, overview and links to TMDB and Letterboxd
export const MovieModal = ({
  movieInfo,
  closeModal,
}: {
  movieInfo: MovieInfo;
  closeModal: () => void;
}) => {
  const handleOverlayClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={handleOverlayClick}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

          {/* Modal panel */}
          <div className="absolute inset-0 transition-opacity">
            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
              <div className="relative w-screen max-w-md">
                {/* Modal content */}
                <div className="transform overflow-hidden rounded-lg bg-gray-800 p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <div className="relative w-full">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${
                            movieInfo.poster_path as string
                          }`}
                          alt={movieInfo.title}
                          width={200}
                          height={200}
                          priority
                        />
                      </div>

                      <h3
                        className="text-lg font-medium leading-6 text-white"
                        id="modal-headline"
                      >
                        {movieInfo.title}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          {movieInfo.release_date?.split("-")[0]}
                        </p>
                        <p className="text-sm text-gray-300">
                          ⭐
                          {Math.round((movieInfo.vote_average as number) * 10) /
                            10}
                          / 10
                        </p>

                        <p className="mt-2 text-sm text-gray-300">
                          {movieInfo.overview}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          <a
                            href={`https://www.themoviedb.org/movie/${movieInfo.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View on TMDB
                          </a>
                        </p>

                        <p className="mt-2 text-sm text-gray-300">
                          <a
                            href={`https://letterboxd.com/search/${movieInfo.title}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View on Letterboxd
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Display the movie recommendations with a poster, title, release year and overview
export const MovieCard = (movieInfo: MovieInfo) => {
  const [showModal, setShowModal] = useState(false);

  const imageWidth = 250;
  const imageHeight = 350;

  if (!movieInfo) return <div>Loading...</div>;

  if (movieInfo.message === "No result found") return null;

  return (
    <div
      className="mt-6 flex transform flex-col gap-1 transition-all duration-200 hover:scale-105"
      onClick={() => setShowModal(true)}
    >
      <div className="mt-4 flex flex-col">
        <h2 className="font-clash_display font-semibold text-yellow-100">
          <p className="cursor-pointer text-xl">{movieInfo.title}</p>{" "}
          <p className="font-archivo">
            ⭐{Math.round((movieInfo.vote_average as number) * 10) / 10}/10
          </p>
        </h2>
        <p className="text-gray-300">{movieInfo.release_date?.split("-")[0]}</p>
      </div>
      <div className="relative w-full">
        <Image
          className="cursor-pointer rounded-sm shadow-lg hover:animate-pulse hover:shadow-2xl hover:shadow-slate-800/90"
          src={`https://image.tmdb.org/t/p/original${
            movieInfo.poster_path as string
          }`}
          alt={movieInfo.title}
          width={imageWidth}
          height={imageHeight}
          priority
        />
      </div>

      {showModal && (
        <MovieModal
          movieInfo={movieInfo}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
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
        <div className="m:grid-cols-2 mt-4 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {moviesInfo?.map((movieInfo: MovieInfo) => (
            <MovieCard key={movieInfo.id} {...movieInfo} />
          ))}
        </div>
      </div>
    );
  }
);

MovieRecommendations.displayName = "MovieRecommendations";

export default MovieRecommendations;
