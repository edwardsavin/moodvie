import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import localFont from "next/font/local";

import Head from "next/head";

const clash_display = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.ttf",
  variable: "--font-clash-display",
});

const archivo = localFont({
  src: "../../public/fonts/Archivo-Variable.ttf",
  variable: "--font-archivo",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dpg37nk6q/image/upload/v1685749044/moodvie-og_bv4xwp.png"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dpg37nk6q/image/upload/v1685749044/moodvie-og_bv4xwp.png"
        />
        <meta
          property="og:description"
          content="Moodvie is a movie recommendation engine that uses your mood to find the perfect movie for you."
        />
        <meta
          property="twitter:description"
          content="Moodvie is a movie recommendation engine that uses your mood to find the perfect movie for you."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@edw_dev" />
        <meta name="twitter:creator" content="@edw_dev" />
        <meta name="twitter:domain" content="moodvie.edwardcs.com" />
      </Head>

      <div
        className={`${archivo.variable} ${clash_display.variable} font-archivo flex h-[100dvh] flex-col`}
      >
        <ClerkProvider {...pageProps} appearance={{ baseTheme: dark }}>
          <Toaster />
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
