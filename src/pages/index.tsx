import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { RecentTracks } from "~/components/recent-tracks";
import { fetchSpotifyToken } from "~/utils/fetchers";

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
    if (error) toast.error(error.message);
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
          {!user.isSignedIn && <SignInButton />}
          {user.isSignedIn && <SignOutButton />}
        </div>
        {spotifyAccessToken && (
          <RecentTracks spotifyAccessToken={spotifyAccessToken} />
        )}
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

export default Home;
