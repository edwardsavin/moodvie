import { toast } from "react-hot-toast";
import getMovieRecommendations from "~/utils/get-movie-recommendations";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";

export type MovieData = {
  recommendationId: string;
  recommendedMovies: Movie[];
  uniqueKey: number;
};

export type Movie = {
  title: string;
  year: string;
};

type Props = {
  songs: string;
  trackData: TrackData;
  handleMovieData: (movieData: MovieData) => void;
};

// Start fetching movie recommendations based on the user's Spotify history
const FetchMovieRecommendationsButton = ({
  songs,
  trackData,
  handleMovieData,
}: Props) => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [uniqueKey, setUniqueKey] = useState<number>(Date.now());

  const minTemperature = 0.5;
  const maxTemperature = 1.5;
  const [temperature, setTemperature] = useState<number>(minTemperature);

  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const { mutate: mutateRecommendation } =
    api.recommendation.create.useMutation();

  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (recommendedMovies.length > 0 && recommendationId) {
      handleMovieData({
        recommendationId,
        recommendedMovies,
        uniqueKey,
      });
    }
  }, [recommendationId, recommendedMovies, uniqueKey, handleMovieData]);

  const handleClick = async () => {
    try {
      setIsFetching(true);
      let movies = await getMovieRecommendations(songs, temperature);

      // Increase temperature on each request to get more diverse results
      if (temperature < maxTemperature) setTemperature(temperature + 0.25);

      // Check if response matches expected template
      const regex = /^\d+\.\s/;
      const hasNumbers = movies.some((movie) => regex.test(movie));
      if (hasNumbers) {
        // Modify response to remove numbers
        const modifiedMovies = movies.map((movie) =>
          movie.replace(/^\d+\.\s/, "")
        );
        movies = modifiedMovies;
      }

      const mappedMovies = movies.map((movie) => {
        const [title, year] = movie.split(" (");
        return { title, year: year?.slice(0, -1) };
      });

      // Set unique key to force re-render of MovieRecommendations component
      setUniqueKey(Date.now());
      setRecommendedMovies(mappedMovies as Movie[]);
      setIsFetching(false);

      mutateRecommendation(
        {
          songsIds: trackData.map((track) => track.id),
          moviesIds: null,
        },
        {
          onSuccess: (data) => {
            setRecommendationId(data.id);
          },
        }
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      {isFetching && (
        <Button
          className="bg-gradient-to-r from-blue-900 to-purple-900 px-10 py-7 font-clash_display text-lg text-gray-50"
          disabled
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      )}

      {!isFetching && (
        <Button
          className="
      bg-gradient-to-r from-blue-900 to-purple-900 px-14 py-7
      font-clash_display text-lg font-semibold text-gray-50 shadow-lg shadow-blue-700/30 
      transition hover:from-blue-800 hover:to-purple-800 hover:shadow-blue-700/40 
      focus:outline-none
      "
          onClick={handleClick as () => void}
        >
          Moodviefy
        </Button>
      )}
    </>
  );
};

export default FetchMovieRecommendationsButton;
