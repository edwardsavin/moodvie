import Hero from "./hero";
import Presentation from "./presentation";

const LandingMain = () => {
  return (
    <main id="content">
      <Hero />
      <Presentation />
    </main>
  );
};

LandingMain.displayName = "LandingMain";

export default LandingMain;
