import useSWR from "swr";
import { toast } from "react-hot-toast";
import { fetchTracks } from "~/utils/fetchers";
import Image from "next/image";
import { useEffect } from "react";

type Track = {
  name: string;
  artist: string;
  id: string;
  album: string;
  image: string;
};

type TrackData = Track[] & { message?: string };

// Display the most recent tracks from the user's Spotify history
export const RecentTracks = ({
  spotifyAccessToken,
}: {
  spotifyAccessToken: string;
}) => {
  const { data: trackData, error: trackDataError } = useSWR(
    spotifyAccessToken
      ? [`./api/spotify-fetch-tracks`, spotifyAccessToken]
      : null,
    fetchTracks
  ) as { data: TrackData | undefined; error: Error };

  useEffect(() => {
    if (trackDataError) toast.error(trackDataError.message);
  }, [trackDataError]);

  if (!trackData)
    return (
      <div>
        <p className="text-white">Almost there...</p>
      </div>
    );

  if (
    trackData.message === "Cannot read properties of undefined (reading 'map')"
  ) {
    return (
      <div>
        Something went wrong, most probably you do not have any songs in your
        Spotify history
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {trackData.map((track) => (
        <div className="text-white" key={track.id}>
          <p>{track.name}</p>
          <p>{track.artist}</p>
          <p>{track.album}</p>
          <Image
            src={track.image}
            width={200}
            height={200}
            alt={track.name}
            priority
          />
        </div>
      ))}
    </div>
  );
};
