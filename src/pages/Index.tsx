import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Residences from "@/components/sections/Residences";
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
