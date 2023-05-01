import { toast } from "react-hot-toast";
import type { TrackData } from "~/pages/api/spotify-fetch-tracks";

// Fetch Spotify token from Clerk API
export const fetchSpotifyToken = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as { token: string };

  return data.token;
};

// Fetch user's Spotify recently played tracks
export const fetchTracks = async (url: string, token: string) => {
  const res = await fetch(`${url}?token=${token}`);
  const data = (await res.json()) as TrackData[];

  if (data.length <= 0) {
    toast.error("No tracks found in your Spotify history.");
    return;
  }

  return data;
};
