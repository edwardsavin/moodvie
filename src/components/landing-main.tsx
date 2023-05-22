import Hero from "./hero";

const LandingMain = () => {
  return (
    <main id="content">
      <Hero />

      {/* One image presentation */}
      <section id="presentation"></section>
    </main>
  );
};

LandingMain.displayName = "LandingMain";

export default LandingMain;
