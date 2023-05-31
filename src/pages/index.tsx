import Head from "next/head";
import LandingMain from "~/components/landing-main";
import MainFooter from "~/components/main-footer";
import MainHeader from "~/components/main-header";
import type { NextPage } from "next";

const Home: NextPage = () => {
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

      <MainHeader />
      <LandingMain />
      <MainFooter />
    </>
  );
};

Home.displayName = "Home";

export default Home;
