import Header from "@/sections/Header/Header";
import Hero from "@/sections/Hero/Hero";
import Stats from "@/sections/Stats/Stats";
import Work from "@/sections/Work/Work";
import Services from "@/sections/Services/Services";
import About from "@/sections/About/About";
import Photos from "@/sections/Photos/Photos";
import Footer from "@/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Stats />
        <Work />
        <Services />
        <About />
        <Photos />
      </main>
      {/* O rodapé é a seção Contato (#contato) */}
      <Footer />
    </>
  );
}
