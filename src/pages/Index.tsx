import Seo from "@/components/seo/Seo";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Collection from "@/components/sections/Collection";
import Residences from "@/components/sections/Residences";
import Standard from "@/components/sections/Standard";
import WhyCity from "@/components/sections/WhyCity";
import Press from "@/components/sections/Press";
import News from "@/components/sections/News";
import CTA from "@/components/sections/CTA";

const Index = () => {
  return (
    <main className="bg-ink text-paper">
      <Seo
        title={"A new vocabulary of living"}
        description={"Small, careful residences in Bengaluru. Materials chosen by hand, delivered to a standard of our own."}
      bare
      />
      <Nav />
      <Hero />
      <Collection />
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
