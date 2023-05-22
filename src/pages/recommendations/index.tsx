import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import { RecentTracks } from "~/components/recent-tracks";
import SignInSpotifyButton from "~/components/signin-spotify";
import { api } from "~/utils/api";
import useSpotifyAccessToken from "~/utils/hooks/use-spotify-access-token";
import { getRandomFetchTracksMessage } from "~/utils/loading-messages";

const Recommendations: NextPage = () => {
  const user = useUser();
  const spotifyAccessToken = useSpotifyAccessToken(user);
  const { mutate: cacheUserRole } = api.user.setRoleInRedis.useMutation();

  useEffect(() => {
    if (user.isSignedIn) {
      cacheUserRole();
    }
  }, [user.isSignedIn, cacheUserRole]);

  return (
    <>
      <Head>
        <title>Recommendations | Moodvie</title>
        <meta
          name="description"
          content="Moodvie - Get movie recommendations based on your mood and music taste."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader />

      <main id="content">
        <section className="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
          <div className="mb-8 flex flex-col items-center">
            <div>{!user.isSignedIn && <SignInSpotifyButton />}</div>

            {user.isSignedIn && !spotifyAccessToken && (
              <p className="text-center text-white">
                {getRandomFetchTracksMessage()}
              </p>
            )}
            {spotifyAccessToken && (
              <RecentTracks spotifyAccessToken={spotifyAccessToken} />
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
};

export default Recommendations;
