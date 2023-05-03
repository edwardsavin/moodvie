import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetchSpotifyToken } from "~/utils/fetchers";
import type { useUser } from "@clerk/clerk-react";

// Fetch Spotify access token from Clerk API
const useSpotifyAccessToken = (user: ReturnType<typeof useUser>) => {
  const { data: spotifyAccessToken, error } = useSWR(
    user.isSignedIn
      ? `./api/auth/spotify-access-token?userId=${user.user.id}`
      : null,
    fetchSpotifyToken
  ) as { data: string | undefined; error: Error };

  useEffect(() => {
    if (error && error instanceof TypeError) {
      toast.error(error.message);
    }
  }, [error]);

  return spotifyAccessToken;
};

export default useSpotifyAccessToken;
