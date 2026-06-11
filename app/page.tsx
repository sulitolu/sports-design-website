import Preloader from "@/components/preloader";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import SelectedWork from "@/components/selected-work";
import Services from "@/components/services";
import About from "@/components/about";
import CtaFooter from "@/components/cta-footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <SelectedWork />
        <Services />
        <About />
      </main>
      <CtaFooter />
    </>
  );
}
