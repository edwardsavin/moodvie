import { toast } from "react-hot-toast";
import type { TrackData } from "~/pages/api/spotify-fetch-tracks";
import type { MovieInfo } from "~/pages/api/tmdb-fetch-movie-info";

// Fetch Spotify token from Clerk API
export const fetchSpotifyToken = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as { token: string };

  return data.token;
};

// Fetch user's Spotify recently played tracks from Spotify API
export const fetchTracks = async (url: string, token: string) => {
  const res = await fetch(`${url}?token=${token}`);
  const data = (await res.json()) as TrackData[];

  if (data.length <= 0) {
    toast.error("No tracks found in your Spotify history.");
    return [];
  }

  return data;
};

// Fetch info about movie from TMDB API
export const fetchMovieInfo = async (
  url: string,
  movieTitles: string,
  movieYears: string
) => {
  const res = await fetch(
    `${url}?movieNames=${movieTitles}&movieYears=${movieYears}`
  );

  const data = (await res.json()) as MovieInfo[];

  return data;
};
