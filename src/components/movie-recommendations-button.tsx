import { toast } from "react-hot-toast";
import getMovieRecommendations from "~/utils/get-movie-recommendations";

// Start fetching movie recommendations based on the user's Spotify history
const FetchMovieRecommendationsButton = (songs: string) => {
  const handleClick = () => {
    const handleAsyncClick = async () => {
      try {
        const movieRecommendations = await getMovieRecommendations(songs);
        console.log(movieRecommendations);
      } catch (error) {
        throw error;
      }
    };

    handleAsyncClick().catch((error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <button
      className="rounded-md bg-white px-4 py-2 text-black"
      onClick={handleClick}
    >
      Get movie recommendations
    </button>
  );
};

export default FetchMovieRecommendationsButton;
