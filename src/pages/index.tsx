import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { toast } from "react-hot-toast";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as { token: string };

  return data.token;
};

const Home: NextPage = () => {
  const user = useUser();
  const { data: spotifyAccessToken, error } = useSWR(
    user.isSignedIn
      ? `./api/auth/spotify-access-token?userId=${user.user.id}`
      : null,
    fetcher
  ) as { data: { token: string } | undefined; error: Error };

  if (error) toast.error(error.message);

  return (
    <>
      <Head>
        <title>Moodvie</title>
        <meta
          name="description"
          content="Moodvie - get movie recommendations based on your music taste"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isSignedIn && <SignInButton />}
          {user.isSignedIn && <SignOutButton />}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

export default Home;
