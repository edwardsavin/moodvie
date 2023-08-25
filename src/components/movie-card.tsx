import Image from "next/image";
import MovieModal from "./movie-modal";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";
import type { Movie } from "@prisma/client";

type MovieCardProps = {
  movieInfo?: MovieInfo;
  movieDb?: Movie;
};

// Truncate the movie title if it's too long
const truncateText = (string: string, maxLength: number) => {
  if (string.length > maxLength) {
    return string.substring(0, maxLength) + "...";
  } else {
    return string;
  }
};

// Display the movie recommendations with a poster, title, release year and overview
const MovieCard = ({ movieInfo, movieDb }: MovieCardProps) => {
  const imageWidth = 250;
  const imageHeight = 350;

  if (!movieInfo && !movieDb) return <div>Loading...</div>;

  if (movieInfo?.message === "No result found") return null;

  return (
    <Dialog>
      <div className="mt-6 flex transform flex-col gap-1 transition-all duration-200 hover:scale-105">
        <div className="mt-4 flex flex-col">
          <h2 className="font-clash_display font-semibold text-yellow-100">
            <p className="cursor-pointer text-xl">
              {truncateText(movieInfo?.title || (movieDb?.title as string), 20)}
            </p>{" "}
            <p className="font-archivo">
              ⭐
              {movieInfo?.vote_average?.toFixed(1) ||
                movieDb?.vote_average?.toFixed(1)}
            </p>
          </h2>
          <p className="text-gray-300">
            {movieInfo?.release_date?.split("-")[0] || movieDb?.year}
          </p>
        </div>
        <div className="relative w-full">
          <DialogTrigger>
            <Image
              className="cursor-pointer rounded-sm shadow-lg hover:animate-pulse hover:shadow-2xl hover:shadow-slate-800/90"
              src={`https://image.tmdb.org/t/p/original${
                (movieInfo?.poster_path as string) || (movieDb?.cover as string)
              }`}
              alt={movieInfo?.title || (movieDb?.title as string)}
              width={imageWidth}
              height={imageHeight}
              priority
            />
          </DialogTrigger>
          <DialogContent className="shadow-2xl shadow-slate-900/50">
            <MovieModal movieInfo={movieInfo} movieDb={movieDb} />
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
};

MovieCard.displayName = "MovieCard";

export default MovieCard;
