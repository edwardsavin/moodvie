import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import type { TrackData } from "~/utils/hooks/use-recent-tracks";

const swipeConfidenceThreshold = 5000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const TracksCarousel = ({ tracks }: { tracks: TrackData }) => {
  const [position, setPosition] = useState(Math.floor(tracks.length / 2));

  const paginate = (newDirection: number) => {
    const newPosition = position + newDirection;

    // Check if new position is within bounds
    if (newPosition >= 0 && newPosition < tracks.length) {
      setPosition(newPosition);
    } else if (newPosition < 0) {
      setPosition(0);
    } else {
      setPosition(tracks.length - 1);
    }
  };

  // Media queries
  const isMediumScreen = useMediaQuery({ minWidth: 768 });
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const isXLargeScreen = useMediaQuery({ minWidth: 1280 });
  const is2XLargeScreen = useMediaQuery({ minWidth: 1536 });

  // Calculate left position
  const calculateLeft = (index: number) => {
    const baseValue = (index - position) * 60 - 30;
    if (is2XLargeScreen) return `${(index - position) * 15 - 7.5}vw`;
    if (isXLargeScreen) return `${(index - position) * 25 - 12.5}vw`;
    if (isLargeScreen) return `${(index - position) * 30 - 15}vw`;
    if (isMediumScreen) return `${(index - position) * 40 - 20}vw`;
    return `${baseValue}vw`;
  };

  return (
    <div className="relative">
      {tracks.map((track, index) => (
        <motion.div
          className="absolute -top-[48vh] left-1/2 w-[60vw] overflow-hidden md:h-[300px] md:w-[300px]"
          key={index}
          animate={{
            left: calculateLeft(index),
            scale: index === position ? 1 : 0.8,
          }}
          style={{
            boxShadow:
              index === position
                ? "0px 25px 50px -12px rgba(237, 237, 237, 0.5)"
                : "none",
          }}
          transition={{ duration: 0.6 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.04}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <Image
            src={track.image}
            alt={track.name}
            width={300}
            height={300}
            className="pointer-events-none w-full"
            style={{
              filter: index === position ? "none" : "brightness(0.98)",
            }}
          ></Image>
          {index === position && (
            <p
              className="pointer-events-none absolute bottom-0 left-0 h-auto w-full animate-fade-in text-center font-clash_display text-2xl font-semibold text-gray-50"
              style={{
                textShadow: "0px 3px 1px rgba(0, 0, 0, 1)",
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)",
              }}
            >
              <span>{track.name}</span>
              <br />
              <span> by {track.artist}</span>
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TracksCarousel;