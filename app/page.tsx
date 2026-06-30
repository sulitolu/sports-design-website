import Preloader from "@/components/preloader";
import CustomCursor from "@/components/custom-cursor";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import SelectedWork from "@/components/selected-work";
import Services from "@/components/services";
import About from "@/components/about";
import Athletes from "@/components/athletes";
import CtaFooter from "@/components/cta-footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <SelectedWork />
        <Services />
        <About />
        <Athletes />
      </main>
      <CtaFooter />
    </>
  );
}
