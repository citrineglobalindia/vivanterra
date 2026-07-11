import Seo from "@/components/seo/Seo";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Collection from "@/components/sections/Collection";
import WhyCity from "@/components/sections/WhyCity";
import News from "@/components/sections/News";

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
      <WhyCity />
      <News />
      <Footer />
    </main>
  );
};

export default Index;
