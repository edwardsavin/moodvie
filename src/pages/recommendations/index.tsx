import Head from "next/head";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import type { NextPage } from "next";
import RecommendationsMain from "~/components/recommendations-main";

const Recommendations: NextPage = () => {
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
      <RecommendationsMain />
      <MainFooter />
    </>
  );
};

Recommendations.displayName = "Recommendations";

export default Recommendations;
