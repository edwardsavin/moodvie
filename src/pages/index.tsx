import { SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SignInSpotifyButton from "~/components/signin-spotify";

const Home: NextPage = () => {
  const user = useUser();

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

      {/* Landing Page */}
      {/* TODO: Separate into its own component */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <header className="flex items-center justify-between p-4">
          {/* Navbar  */}
          {/*  TODO: Separate into its own component */}
          {user.isSignedIn && (
            <div className="flex  items-center justify-between">
              <SignOutButton />
              <Link href="/recommendations" className="text-white">
                Recommendations
              </Link>
              <Link href="/history" className="text-white">
                History
              </Link>
            </div>
          )}
        </header>

        <main>
          {/* Hero */}
          {/*  TODO: Separate into its own component */}
          <div className="flex flex-col items-center justify-center">
            <h1
              className="text-center text-4xl font-bold text-white 
            sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            >
              Discover Your Perfect Film: Unleash Your Mood and Music Taste for
              Personalized Movie Recommendations!
            </h1>
            <p className="text-center text-white">
              Get movie recommendations based on your mood and music taste.
            </p>

            <div className="mt-4">
              {!user.isSignedIn && <SignInSpotifyButton />}
              {user.isSignedIn && (
                <Link href="/recommendations">
                  <button
                    className="
                      rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700
                      "
                  >
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Footer */}
          {/* TODO: Separate into its own component */}
          <div className="mt-4">
            <p className="text-center text-white">
              Copyright © {new Date().getFullYear()}
              <a
                href="https://edwardcs.com"
                className="text-green-500"
                target="_blank"
              >
                {" "}
                Edward Savin
              </a>
            </p>

            <p className="text-center text-white">
              Powered by{" "}
              <a
                href="https://www.spotify.com/"
                className="text-green-500"
                target="_blank"
              >
                Spotify
              </a>{" "}
              ,{" "}
              <a
                href="https://www.themoviedb.org/"
                className="text-green-500"
                target="_blank"
              >
                The Movie Database
              </a>
              ,{" "}
              <a
                href="https://www.vercel.com/"
                className="text-green-500"
                target="_blank"
              >
                Vercel
              </a>{" "}
              and{" "}
              <a
                href="https://www.create.t3.gg"
                className="text-green-500"
                target="_blank"
              >
                T3
              </a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
