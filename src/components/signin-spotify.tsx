import { SignInButton } from "@clerk/nextjs";

const SignInSpotifyButton = () => {
  return (
    <SignInButton mode="modal" redirectUrl="/recommendations">
      <button className="rounded bg-green-600 px-6 py-3 font-clash_display text-lg font-semibold text-gray-50 transition duration-300 ease-in-out hover:bg-green-700">
        Sign in with Spotify
      </button>
    </SignInButton>
  );
};

export default SignInSpotifyButton;
