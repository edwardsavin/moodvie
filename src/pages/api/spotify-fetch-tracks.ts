import type { NextApiRequest, NextApiResponse } from "next";

export type TrackData = {
  items: {
    track: {
      name: string;
      artists: { name: string }[];
      id: string;
      album: {
        name: string;
        images: { url: string }[];
      };
    };
  }[];
};

// Fetch user's Spotify recently played tracks
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.query.token as string;

  try {
    const result = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=5",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = (await result.json()) as TrackData;

    const tracks = data.items.map((item) => {
      const track = item.track;
      return {
        name: track.name,
        artist: track.artists?.[0]?.name ?? "Unknown Artist",
        id: track.id,
        album: track.album.name ?? "Unknown Album",
        image:
          track.album.images?.[0]?.url ??
          `https://via.placeholder.com/200x300?text=${track.name}`,
      };
    });

    if (tracks) {
      res.status(200).json(tracks);
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
}
