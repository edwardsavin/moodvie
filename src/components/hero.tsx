import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import DemoInfoModal from "~/components/demo-info-modal";

const Hero = () => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <section
      id="hero"
      className="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28"
    >
      <div className="mx-auto max-w-[800px] xl:max-w-7xl">
        <div className="lg:px-8">
          <div className="flex flex-col items-center">
            <div className="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6xl">
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex flex-col items-center justify-between">
                  <h1 className="text-center font-clash_display text-4xl font-semibold tracking-tight text-gray-50 sm:text-6xl sm:tracking-tight lg:text-[4rem] xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]">
                    Unleash your{" "}
                    <span className="bg-gradient-to-r from-green-500 to-purple-700 bg-clip-text text-transparent">
                      MOOD
                    </span>{" "}
                    and dive into{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      personalized
                    </span>{" "}
                    movie picks!
                  </h1>
                  <p className="mt-4 text-center text-xl text-gray-300">
                    Get movie recommendations based on your mood and music
                    taste.
                  </p>

                  <div className="mt-4 flex w-full items-center justify-center gap-4 xl:mt-8">
                    {!user.isSignedIn && <DemoInfoModal />}

                    {isLoading && (
                      <Button
                        className="rounded bg-green-600/80 px-5 py-6 font-clash_display text-lg font-semibold text-gray-50"
                        disabled
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </Button>
                    )}

                    {!isLoading && user.isSignedIn && (
                      <Button
                        asChild
                        onClick={handleClick as () => void}
                        className="rounded bg-green-600 px-5 py-6 font-clash_display text-lg font-semibold text-gray-50 transition duration-300 ease-in-out hover:bg-green-700"
                      >
                        <Link href="/recommendations">Get Started</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Hero.displayName = "Hero";

export default Hero;
