import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetchSpotifyToken, fetchTracks } from "~/utils/fetchers";
import type { TrackData } from "./api/spotify-fetch-tracks";

const Home: NextPage = () => {
  const user = useUser();

  // Fetch Spotify access token from Clerk API
  const { data: spotifyAccessToken, error } = useSWR(
    user.isSignedIn
      ? `./api/auth/spotify-access-token?userId=${user.user.id}`
      : null,
    fetchSpotifyToken
  ) as { data: string | undefined; error: Error };

  // Fetch tracks from Spotify
  const { data: trackData, error: trackDataError } = useSWR(
    spotifyAccessToken
      ? [`./api/spotify-fetch-tracks`, spotifyAccessToken]
      : null,
    fetchTracks
  ) as { data: TrackData[] | undefined; error: Error };

  if (error) toast.error(error.message);
  if (trackDataError) toast.error(trackDataError.message);

  useEffect(() => {
    if (trackData) {
      console.log(trackData);
    }
  }, [trackData]);

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
          {!user.isSignedIn && <SignInButton />}
          {user.isSignedIn && <SignOutButton />}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

export default Home;
