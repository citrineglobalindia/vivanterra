import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Residences from "@/components/sections/Residences";
import Collaborations from "@/components/sections/Collaborations";
import CollaborationsGrid from "@/components/sections/CollaborationsGrid";
import ExecutiveImpactCarousel from "@/components/ui/executive-impact-carousel";
import StickyScroll from "@/components/ui/sticky-scroll";
import GlobalPresence from "@/components/sections/GlobalPresence";
import Standard from "@/components/sections/Standard";
import WhyCity from "@/components/sections/WhyCity";
import Press from "@/components/sections/Press";
import News from "@/components/sections/News";
import CTA from "@/components/sections/CTA";

const Index = () => {
  return (
    <main className="bg-ink text-paper">
      <Nav />
      <Hero />
      <Residences />
      <ExecutiveImpactCarousel />
      <StickyScroll />
      <CollaborationsGrid />
      <GlobalPresence />
      <Collaborations />
      <Standard />
      <WhyCity />
      <Press />
      <News />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
