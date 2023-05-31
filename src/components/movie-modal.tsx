import Image from "next/image";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import type { Movie } from "@prisma/client";

type MovieModalProps = {
  movieInfo?: MovieInfo;
  movieDb?: Movie;
};

// Display the movie recommendations modal with a poster, title, release year, overview and links to TMDB and Letterboxd
const MovieModal = ({ movieInfo, movieDb }: MovieModalProps) => {
  const imageWidth = 250;
  const imageHeight = 350;

  return (
    <DialogHeader className="gap-6">
      <DialogTitle>
        <div className="font-clash_display text-2xl font-semibold text-yellow-100">
          {movieInfo?.title || movieDb?.title} (
          {movieInfo?.release_date?.split("-")[0] || movieDb?.year})
        </div>
      </DialogTitle>

      <DialogDescription className="flex flex-col items-center gap-2">
        <span className="font-clash_display text-lg font-semibold text-yellow-100">
          ⭐
          {Math.round(
            (movieInfo?.vote_average || (movieDb?.vote_average as number)) * 10
          ) / 10}
          / 10
        </span>

        <Image
          className="mb-4 rounded-sm shadow-2xl shadow-slate-800/90"
          src={
            movieInfo?.poster_path
              ? `https://image.tmdb.org/t/p/original${movieInfo.poster_path}`
              : (movieDb?.cover as string)
          }
          alt={movieInfo?.title || (movieDb?.title as string)}
          width={imageWidth}
          height={imageHeight}
          priority
        />

        <span className="mb-4 mt-2 font-archivo text-lg">
          {movieInfo?.overview || movieDb?.overview}
        </span>
      </DialogDescription>

      <DialogFooter className="flex flex-col items-center gap-2">
        <a
          href={`https://www.themoviedb.org/movie/${
            movieInfo?.id || (movieDb?.tmdbId as number)
          }`}
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
          href={`https://letterboxd.com/search/${
            movieInfo?.title || (movieDb?.title as string)
          }/`}
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

MovieModal.displayName = "MovieModal";

export default MovieModal;
