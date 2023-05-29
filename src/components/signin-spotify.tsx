import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const SignInSpotifyButton = () => {
  return (
    <SignInButton mode="modal" redirectUrl="/recommendations">
      <Button className="rounded bg-green-600 px-5 py-6 font-clash_display text-lg font-semibold text-gray-50 transition duration-300 ease-in-out hover:bg-green-700">
        Sign in with Spotify
      </Button>
    </SignInButton>
  );
};

export default SignInSpotifyButton;
