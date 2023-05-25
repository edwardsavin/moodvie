import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import { RecentTracks } from "~/components/recent-tracks";
import SignInSpotifyButton from "~/components/signin-spotify";
import { api } from "~/utils/api";
import useSpotifyAccessToken from "~/utils/hooks/use-spotify-access-token";
import { getRandomFetchTracksMessage } from "~/utils/loading-messages";
import FetchMovieRecommendationsButton from "~/components/movie-recommendations-button";
import MovieRecommendations from "~/components/movie-recommendation";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";
import type { MovieData } from "~/components/movie-recommendations-button";
import type { NextPage } from "next";

const Recommendations: NextPage = () => {
  // Get track data from RecentTracks component
  const [trackData, setTrackData] = useState<TrackData>([]);
  const handleTrackData = (data: TrackData) => setTrackData(data);

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const handleMovieData = useCallback((data: MovieData) => {
    setMovieData(data);
  }, []);

  const user = useUser();
  const spotifyAccessToken = useSpotifyAccessToken(user);
  const { mutate: cacheUserRole } = api.user.setRoleInRedis.useMutation();

  useEffect(() => {
    if (user.isSignedIn) {
      cacheUserRole();
    }
  }, [user.isSignedIn, cacheUserRole]);

  const songsString = trackData
    .map((song, index) => `${index + 1}. ${song.name} by ${song.artist}`)
    .join("; ");

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
              <>
                <RecentTracks
                  spotifyAccessToken={spotifyAccessToken}
                  handleTrackData={handleTrackData}
                />

                {trackData.length > 0 && (
                  <>
                    <FetchMovieRecommendationsButton
                      songs={songsString}
                      trackData={trackData}
                      handleMovieData={handleMovieData}
                    />

                    {movieData && (
                      <MovieRecommendations
                        key={movieData.uniqueKey}
                        movies={movieData.recommendedMovies}
                        recommendationId={movieData.recommendationId}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
};

export default Recommendations;
