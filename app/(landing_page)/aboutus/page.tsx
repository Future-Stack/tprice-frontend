import AboutHero from "./components/AboutHero";
import MissionVision from "./components/MissionVision";
import Trust from "../components/sections/Trust";
import Partners from "../components/sections/Partners";
import AboutCTA from "./components/AboutCTA";
import ScrollToTop from "../components/ScrollToTop";

export default function AboutUsPage() {
  return (
    <main className="bg-black">
      <AboutHero />
      <MissionVision />
      <Trust />
      <Partners />
      <AboutCTA />
      <ScrollToTop />
    </main>
  );
}