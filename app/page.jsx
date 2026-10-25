import Header from "@/sections/Header/Header";
import Hero from "@/sections/Hero/Hero";
import Stats from "@/sections/Stats/Stats";
import Work from "@/sections/Work/Work";
import About from "@/sections/About/About";
import Footer from "@/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Stats />
        <Work />
        <About />
      </main>
      <Footer />
    </>
  );
}
