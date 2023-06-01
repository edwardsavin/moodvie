import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";

const SignInSpotifyButton = () => {
  return (
    <SignInButton mode="modal" redirectUrl="/recommendations">
      <Button className="rounded bg-green-600 px-5 py-6 font-clash_display text-lg font-semibold text-gray-50 transition duration-300 ease-in-out hover:bg-green-700">
        <span className="mr-1.5">Sign in with Spotify</span>
        <Image
          src="/Spotify_Icon_RGB_White.png"
          alt="Spotify logo"
          width={21}
          height={21}
        />
      </Button>
    </SignInButton>
  );
};

export default SignInSpotifyButton;
