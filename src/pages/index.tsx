import { SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { RecentTracks } from "~/components/recent-tracks";
import SignInSpotifyButton from "~/components/signin-spotify";
import useSpotifyAccessToken from "~/utils/hooks/use-spotify-access-token";
import { getRandomFetchTracksMessage } from "~/utils/loading-messages";

const Home: NextPage = () => {
  const user = useUser();
  const spotifyAccessToken = useSpotifyAccessToken(user);

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
