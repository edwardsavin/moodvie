import Image from "next/image";
import useTmdbMovieInfo from "~/utils/hooks/use-tmdb-movie-info";
import { forwardRef, useEffect, useState } from "react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import type { Movie } from "./movie-recommendations-button";

type MovieRecommendationsProps = {
  movies: Movie[];
  recommendationId: string;
};

// Display the movie recommendations modal with a poster, title, release year, overview and links to TMDB and Letterboxd
export const MovieModal = ({ movieInfo }: { movieInfo: MovieInfo }) => {
  const imageWidth = 250;
  const imageHeight = 350;

  return (
    <DialogHeader className="gap-4">
      <DialogTitle>
        <div className="font-clash_display text-2xl font-semibold text-yellow-100">
          {movieInfo.title} ({movieInfo.release_date?.split("-")[0]})
        </div>
      </DialogTitle>

      <DialogDescription className="flex flex-col items-center gap-2">
        <div className="font-clash_display text-lg font-semibold text-yellow-100">
          ⭐{Math.round((movieInfo.vote_average as number) * 10) / 10}/ 10
        </div>

        <Image
          className="mb-4 rounded-sm shadow-2xl shadow-slate-800/90"
          src={`https://image.tmdb.org/t/p/original${
            movieInfo.poster_path as string
          }`}
          alt={movieInfo.title}
          width={imageWidth}
          height={imageHeight}
          priority
        />

        <div className="font-archivo text-base">{movieInfo.overview}</div>
      </DialogDescription>

      <DialogFooter className="flex flex-col items-center gap-1">
        <a
          href={`https://www.themoviedb.org/movie/${movieInfo.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/tmdb-alt-short.svg"
            alt="The Movie Database"
            width={160}
            height={160}
          />
        </a>

        <a
          href={`https://letterboxd.com/search/${movieInfo.title}`}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/letterboxd-horizontal.svg"
            alt="Letterboxd"
            width={160}
            height={160}
          />
        </a>
      </DialogFooter>
    </DialogHeader>
  );
};

// Display the movie recommendations with a poster, title, release year and overview
export const MovieCard = (movieInfo: MovieInfo) => {
  const imageWidth = 250;
  const imageHeight = 350;

  if (!movieInfo) return <div>Loading...</div>;

  if (movieInfo.message === "No result found") return null;

  return (
    <Dialog>
      <div className="mt-6 flex transform flex-col gap-1 transition-all duration-200 hover:scale-105">
        <div className="mt-4 flex flex-col">
          <h2 className="font-clash_display font-semibold text-yellow-100">
            <p className="cursor-pointer text-xl">{movieInfo.title}</p>{" "}
            <p className="font-archivo">
              ⭐{Math.round((movieInfo.vote_average as number) * 10) / 10}/10
            </p>
          </h2>
          <p className="text-gray-300">
            {movieInfo.release_date?.split("-")[0]}
          </p>
        </div>
        <div className="relative w-full">
          <DialogTrigger>
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
          </DialogTrigger>
          <DialogContent className="shadow-2xl shadow-slate-900/50">
            <MovieModal movieInfo={movieInfo} />
          </DialogContent>
        </div>
      </div>
    </Dialog>
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
