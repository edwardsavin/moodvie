import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import SignInSpotifyButton from "~/components/signin-spotify";
import Image from "next/image";
import { useState } from "react";

const DemoInfoModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded bg-green-600 px-5 py-6 font-clash_display text-lg font-semibold text-gray-50 transition duration-300 ease-in-out hover:bg-green-700">
          <span className="mr-1.5">Sign in with Spotify</span>
          <Image
            src="/Spotify_Icon_RGB_White.png"
            alt="Spotify logo"
            width={21}
            height={21}
          />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Currently awaiting Spotify approval. Please copy and use the demo
            account below at Spotify login.
          </DialogTitle>
          <DialogDescription>
            <p className="font-archivo text-lg">
              Email:{" "}
              <span className="font-semibold">testmoodvie@gmail.com</span>
            </p>
            <p className="font-archivo text-lg">
              Password: <span className="font-semibold">moodvie1234@</span>
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button onClick={() => setOpen(false)}>
            <SignInSpotifyButton />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoInfoModal;
