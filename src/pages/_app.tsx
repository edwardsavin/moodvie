import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import localFont from "next/font/local";

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
    <div
      className={`${archivo.variable} ${clash_display.variable} font-archivo`}
    >
      <ClerkProvider {...pageProps} appearance={{ baseTheme: dark }}>
        <Toaster />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
