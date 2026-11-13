import Header from "@/sections/Header/Header";
import Hero from "@/sections/Hero/Hero";
import Partners from "@/sections/Partners/Partners";
import Work from "@/sections/Work/Work";
import Services from "@/sections/Services/Services";
import About from "@/sections/About/About";
import Photos from "@/sections/Photos/Photos";
import Footer from "@/sections/Footer/Footer";
import JsonLd from "@/components/JsonLd/JsonLd";
import { buildJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={buildJsonLd()} />
      <Header />
      <main id="conteudo">
        <Hero />
        <Partners />
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
