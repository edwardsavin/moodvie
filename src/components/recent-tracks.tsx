import useRecentTracks from "~/utils/hooks/use-recent-tracks";
import { api } from "~/utils/api";
import { useEffect } from "react";
import TracksCarousel from "./tracks-carousel";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";

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
  handleTrackData,
}: {
  spotifyAccessToken: string;
  handleTrackData: (data: TrackData) => void;
}) => {
  const trackData = useRecentTracks(spotifyAccessToken);

  const { mutate } = api.song.createMany.useMutation();

  // Create songs in the database
  useEffect(() => {
    if (trackData) mutate({ songs: transformTrackData(trackData) });
  }, [trackData, mutate]);

  // Send the data to the parent component
  useEffect(() => {
    if (trackData) handleTrackData(trackData);
  }, [trackData, handleTrackData]);

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

  return (
    <div className="flex h-80 w-screen flex-col items-center overflow-hidden sm:h-[32rem] md:h-96">
      <TracksCarousel songs={trackData} />
    </div>
  );
};
