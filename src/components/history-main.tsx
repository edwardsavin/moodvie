import MovieCard from "~/components/movie-card";
import TracksCarousel from "~/components/tracks-carousel";
import { Separator } from "~/components/ui/separator";
import type { RecommendationsProp } from "~/pages/history";

type HistoryMainProps = {
  recommendations?: RecommendationsProp[];
};

const HistoryMain = (
  { recommendations }: HistoryMainProps = { recommendations: [] }
) => {
  return (
    <main id="content" className="flex-grow">
      <section className="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
        <div className="mx-auto max-w-[800px] xl:max-w-7xl">
          <div className="lg:px-8">
            <div className="flex flex-col items-center">
              <div className="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6xl">
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex flex-col items-center justify-between gap-32">
                    <h1 className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-center font-clash_display text-4xl font-semibold tracking-tight text-gray-200 text-transparent sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]">
                      Your history
                    </h1>

                    {recommendations?.map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className="flex flex-col items-center"
                      >
                        <div className="flex h-80 w-screen flex-col items-center overflow-hidden sm:h-[32rem] md:h-96">
                          <TracksCarousel songsDb={recommendation.songs} />
                        </div>

                        <div className="flex justify-center">
                          <div className="m:grid-cols-2 mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5">
                            {recommendation.movies.map((movie) => (
                              <MovieCard key={movie.id} movieDb={movie} />
                            ))}
                          </div>
                        </div>

                        <Separator className="mt-8" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

HistoryMain.displayName = "HistoryMain";

export default HistoryMain;
