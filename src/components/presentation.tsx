import Link from "next/link";

const Presentation = () => (
  <section id="presentation" className="mx-8 flex justify-center">
    <figure>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/moodvie-presentation-poster.jpg"
        width="1200px"
        className="rounded-lg border-4 border-neutral-900 bg-neutral-900 shadow-xl md:hidden"
      >
        <source src="/moodvie-presentation.mp4" type="video/mp4" />
        You need a browser that supports HTML5 video to view this video.
      </video>

      <Link
        className="hidden rounded-lg border-[20px] border-neutral-900 bg-neutral-900 
          shadow-[0px_-24px_300px_0px_rgba(57,140,203,0.15)] transition 
          hover:shadow-[0px_-24px_150px_0px_rgba(57,140,203,0.3)] md:block"
        href="/recommendations"
        title="Click to moodviefy your music taste!"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/moodvie-presentation-poster.jpg"
          width="1200px"
        >
          <source src="/moodvie-presentation.mp4" type="video/mp4" />
          You need a browser that supports HTML5 video to view this video.
        </video>
      </Link>
    </figure>
  </section>
);

Presentation.displayName = "Presentation";

export default Presentation;
