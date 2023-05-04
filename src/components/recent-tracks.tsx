import Image from "next/image";
import useRecentTracks from "~/utils/hooks/use-recent-tracks";

// Display the most recent tracks from the user's Spotify history
export const RecentTracks = ({
  spotifyAccessToken,
}: {
  spotifyAccessToken: string;
}) => {
  const trackData = useRecentTracks(spotifyAccessToken);

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
