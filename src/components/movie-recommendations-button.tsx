import { toast } from "react-hot-toast";
import getMovieRecommendations from "~/utils/get-movie-recommendations";
import { useState } from "react";
import MovieRecommendations from "./movie-recommendation";

export type Movie = {
  title: string;
  year: string;
};

// Start fetching movie recommendations based on the user's Spotify history
const FetchMovieRecommendationsButton = (songs: { songsString: string }) => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  const handleClick = async () => {
    try {
      const movies = await getMovieRecommendations(songs.songsString);

      const mappedMovies = movies.map((movie) => {
        const [title, year] = movie.split(" (");
        return { title, year: year?.slice(0, -1) };
      });

      setRecommendedMovies(mappedMovies as Movie[]);
    } catch (error) {
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <>
      <button
        className="rounded-md bg-white px-4 py-2 text-black"
        onClick={handleClick as () => void}
      >
        Get movie recommendations
      </button>
      {recommendedMovies.length > 0 && (
        <MovieRecommendations movies={recommendedMovies} />
      )}
    </>
  );
};

export default FetchMovieRecommendationsButton;
