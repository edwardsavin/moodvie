import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { generateSSRHelper } from "../helpers/ssrHelper";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

// Page component for showing the user's history of recommendations
const History: NextPage = () => {
  const recommendationsQuery = api.recommendation.getAllByUserId.useQuery();

  const { data: recommendations } = recommendationsQuery;

  return (
    <>
      <Head>
        <title>Moodvie</title>
        <meta
          name="description"
          content="Moodvie - Get movie recommendations based on your mood and music taste."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Link href="/" className="text-white">
          Home
        </Link>
        <h1 className="mb-4 mt-4 text-4xl text-white">
          Your recommendations history
        </h1>
        <div className="flex flex-col items-center justify-center space-y-8">
          {recommendations?.map((recommendation) => (
            <div
              key={recommendation.id}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-full bg-[#15162c] p-8"></div>
              <div className="flex flex-col items-center">
                <h3 className="text-white">Songs</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {recommendation.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex flex-col items-center space-y-2"
                    >
                      <h4 className="text-white">{song.title}</h4>
                      <h5 className="text-white">{song.artist}</h5>
                      <h5 className="text-white">{song.album}</h5>
                      <Image
                        src={song.cover as string}
                        alt={song.title}
                        width={200}
                        height={200}
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-white">Movies</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {recommendation.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex flex-col items-center space-y-2"
                    >
                      <h4 className="text-white">{movie.title}</h4>
                      <h5 className="text-white">{movie.year}</h5>
                      <h5 className="text-white">{movie.vote_average}</h5>
                      <Image
                        src={movie.cover as string}
                        alt={movie.title}
                        width={200}
                        height={200}
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  const ssr = generateSSRHelper();

  await ssr.recommendation.getAllByUserId.prefetch();

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};

export default History;
