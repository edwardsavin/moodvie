import Head from "next/head";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import RecommendationsMain from "~/components/recommendations-main";
import type { NextPage } from "next";

const Recommendations: NextPage = () => {
  return (
    <>
      <Head>
        <title>Recommendations | Moodvie</title>
        <meta
          name="description"
          content="Moodvie - Get movie recommendations based on your mood and music taste."
        />
        <meta property="og:title" content="Recommendations | Moodvie" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://moodvie.edwardcs.com/recommendations"
        />
        <meta property="twitter:title" content="Recommendations | Moodvie" />
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
