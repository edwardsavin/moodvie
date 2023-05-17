import { SignInButton } from "@clerk/nextjs";

const SignInSpotifyButton = () => {
  return (
    <SignInButton mode="modal" redirectUrl="/recommendations">
      <button
        className="
              rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700
              "
      >
        Sign in with Spotify
      </button>
    </SignInButton>
  );
};

export default SignInSpotifyButton;
