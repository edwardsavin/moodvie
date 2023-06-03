import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RecentTracks } from "~/components/recent-tracks";
import SignInSpotifyButton from "~/components/signin-spotify";
import { api } from "~/utils/api";
import useSpotifyAccessToken from "~/utils/hooks/use-spotify-access-token";
import { getRandomFetchTracksMessage } from "~/utils/loading-messages";
import FetchMovieRecommendationsButton from "~/components/movie-recommendations-button";
import MovieRecommendations from "~/components/movie-recommendation";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";
import type { MovieData } from "~/components/movie-recommendations-button";

const RecommendationsMain = () => {
  // Get track data from RecentTracks component
  const [trackData, setTrackData] = useState<TrackData>([]);
  const [movieData, setMovieData] = useState<MovieData | null>(null);

  const handleTrackData = useCallback((data: TrackData) => {
    setTrackData(data);
  }, []);
  const handleMovieData = useCallback((data: MovieData) => {
    setMovieData(data);
  }, []);

  const user = useUser();
  const spotifyAccessToken = useSpotifyAccessToken(user);
  const { mutate: cacheUserRole } = api.user.setRoleInRedis.useMutation();

  const MovieRecommendationsRef = useRef<HTMLDivElement>(null);

  // Scroll to movie recommendations when they are fetched
  useEffect(() => {
    setTimeout(() => {
      if (MovieRecommendationsRef.current) {
        MovieRecommendationsRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  }, [movieData]);

  useEffect(() => {
    if (user.isSignedIn) {
      cacheUserRole();
    }
  }, [user.isSignedIn, cacheUserRole]);

  const songsString = useMemo(() => {
    return trackData
      .map((song, index) => `${index + 1}. ${song.name} by ${song.artist}`)
      .join("; ");
  }, [trackData]);

  return (
    <main id="content" className="flex-grow">
      <section className="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
        <div className="flex flex-col items-center">
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
                      ref={MovieRecommendationsRef}
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
  );
};

RecommendationsMain.displayName = "RecommendationsMain";

export default RecommendationsMain;
