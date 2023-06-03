import Head from "next/head";
import HistoryMain from "~/components/history-main";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import { generateSSRHelper } from "~/server/helpers/ssrHelper";
import { api } from "~/utils/api";
import type { Movie, Song } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

export type RecommendationsProp = {
  id: string;
  songs: Song[];
  movies: Movie[];
};

// Page component for showing the user's history of recommendations
const History: NextPage = () => {
  const recommendationsQuery = api.recommendation.getAllByUserId.useQuery();

  const { data: recommendations } = recommendationsQuery;

  return (
    <>
      <Head>
        <title>History | Moodvie</title>
        <meta
          name="description"
          content="Moodvie - Get movie recommendations based on your mood and music taste."
        />
        <meta property="og:title" content="History | Moodvie" />
        <meta
          property="og:url"
          content="https://moodvie.edwardcs.com/history"
        />
        <meta property="twitter:title" content="History | Moodvie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader />
      <HistoryMain recommendations={recommendations} />
      <MainFooter />
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

History.displayName = "HistoryPage";

export default History;
