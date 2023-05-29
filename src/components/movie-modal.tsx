import Image from "next/image";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";

// Display the movie recommendations modal with a poster, title, release year, overview and links to TMDB and Letterboxd
const MovieModal = ({ movieInfo }: { movieInfo: MovieInfo }) => {
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

MovieModal.displayName = "MovieModal";

export default MovieModal;
