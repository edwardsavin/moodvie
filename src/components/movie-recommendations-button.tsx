import { toast } from "react-hot-toast";
import getMovieRecommendations from "~/utils/get-movie-recommendations";
import { useState } from "react";
import MovieRecommendations from "./movie-recommendation";
import { api } from "~/utils/api";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";

export type Movie = {
  title: string;
  year: string;
};

type Props = {
  songs: string;
  trackData: TrackData;
};

// Start fetching movie recommendations based on the user's Spotify history
const FetchMovieRecommendationsButton = ({ songs, trackData }: Props) => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [uniqueKey, setUniqueKey] = useState<number>(Date.now());

  const minTemperature = 0.5;
  const maxTemperature = 1.5;
  const [temperature, setTemperature] = useState<number>(minTemperature);

  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const { mutate: mutateRecommendation } =
    api.recommendation.create.useMutation();

  const handleClick = async () => {
    try {
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
      <button
        className="rounded-md bg-white px-4 py-2 text-black"
        onClick={handleClick as () => void}
      >
        Get movie recommendations
      </button>
      {recommendedMovies.length > 0 && recommendationId && (
        <MovieRecommendations
          key={uniqueKey}
          movies={recommendedMovies}
          recommendationId={recommendationId}
        />
      )}
    </>
  );
};

export default FetchMovieRecommendationsButton;
