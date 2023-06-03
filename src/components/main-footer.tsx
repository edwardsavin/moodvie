import { Separator } from "./ui/separator";
import Image from "next/image";
import spotifyLogo from "../../public/Spotify_Logo_RGB_Green.png";

const MainFooter = () => (
  <footer className="mt-auto w-full py-12 text-center">
    <div className="flex flex-col items-center justify-center gap-4">
      <a
        href="https://www.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2"
      >
        <div className="flex items-center justify-center gap-1">
          <p className="font-clash_display text-sm font-semibold text-gray-300">
            Powered by
          </p>
          <Image src={spotifyLogo} alt="Spotify logo" width={80} height={24} />
        </div>
      </a>

      <div className="flex items-center justify-center gap-2">
        <p className="text-gray-500">Copyright © {new Date().getFullYear()}</p>
        <Separator orientation="vertical" className="h-4" />
        <a
          href="https://edwardcs.com"
          className="text-xl font-semibold text-green-500 hover:text-green-700"
          target="_blank"
        >
          Edward Savin
        </a>
      </div>
    </div>
  </footer>
);

MainFooter.displayName = "MainFooter";

export default MainFooter;
