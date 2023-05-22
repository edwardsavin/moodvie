import Hero from "./hero";
import type { useUser } from "@clerk/nextjs";

const LandingMain = ({ user }: { user: ReturnType<typeof useUser> }) => {
  return (
    <main id="content">
      <Hero user={user} />

      {/* One image presentation */}
      <section id="presentation"></section>
    </main>
  );
};

LandingMain.displayName = "LandingMain";

export default LandingMain;
