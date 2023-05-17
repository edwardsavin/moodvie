import Image from "next/image";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";

// Display a single track
const TrackItem = ({ track }: { track: TrackData[0] }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-white">
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
    </div>
  );
};

export default TrackItem;
