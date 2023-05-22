import useRecentTracks from "~/utils/hooks/use-recent-tracks";
import FetchMovieRecommendationsButton from "./movie-recommendations-button";
import { api } from "~/utils/api";
import { useEffect } from "react";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";
import TracksCarousel from "./tracks-carousel";

// Prepare the data to be sent to the backend
const transformTrackData = (tracks: TrackData) => {
  return tracks.map((track) => ({
    spotifyId: track.id,
    title: track.name,
    album: track.album,
    artist: track.artist,
    cover: track.image,
  }));
};

// Display the most recent tracks from the user's Spotify history
export const RecentTracks = ({
  spotifyAccessToken,
}: {
  spotifyAccessToken: string;
}) => {
  const trackData = useRecentTracks(spotifyAccessToken);

  const { mutate } = api.song.createMany.useMutation();

  // Create songs in the database
  useEffect(() => {
    if (trackData) mutate({ songs: transformTrackData(trackData) });
  }, [trackData, mutate]);

  if (!trackData)
    return (
      <div>
        <p className="text-white">Almost there...</p>
      </div>
    );

  if (trackData.length === 0) {
    return (
      <div className="p-8 text-center font-clash_display text-2xl font-semibold text-red-500 lg:p-0 lg:text-4xl">
        <p>
          {" "}
          Something went wrong, most probably you do not have any songs in your
          Spotify history.{" "}
        </p>
        <br />
        <p>Please listen to some songs and come back later.</p>
      </div>
    );
  }

  const songsString = trackData
    .map((song, index) => `${index + 1}. ${song.name} by ${song.artist}`)
    .join("; ");

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <TracksCarousel tracks={trackData} />

      {trackData.length > 0 && (
        <FetchMovieRecommendationsButton
          songs={songsString}
          trackData={trackData}
        />
      )}
    </div>
  );
};
