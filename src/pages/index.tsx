import { SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { RecentTracks } from "~/components/recent-tracks";
import SignInSpotifyButton from "~/components/signin-spotify";
import { fetchSpotifyToken } from "~/utils/fetchers";
import { getRandomFetchTracksMessage } from "~/utils/loading-messages";

const Home: NextPage = () => {
  const user = useUser();

  // Fetch Spotify access token from Clerk API
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

  return (
    <>
      <Head>
        <title>Moodvie</title>
        <meta
          name="description"
          content="Moodvie - get movie recommendations based on your music taste"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isSignedIn && <SignInSpotifyButton />}
          {user.isSignedIn && <SignOutButton />}
        </div>

        {user.isSignedIn && !spotifyAccessToken && (
          <p className="text-center text-white">
            {getRandomFetchTracksMessage()}
          </p>
        )}
        {spotifyAccessToken && (
          <RecentTracks spotifyAccessToken={spotifyAccessToken} />
        )}
      </main>
    </>
  );
};

export default Home;
