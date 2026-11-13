import { getSiteUrl } from "@/lib/siteUrl";
import { about, services, social } from "@/content/site";

// Texto do resultado no Google: title até ~60 e description entre 120 e 160 caracteres
export const siteTitle = "Welinton Carmelo · Videomaker & Estratégia";
export const siteDescription =
  "Videomaker em São Paulo: reels, aftermovies e vídeos para marcas no Instagram e TikTok, com produção, edição e estratégia. Fale com Welinton Carmelo.";

// Área atendida (provisório, confirmar com o Welinton)
const AREA_SERVED = [
  { "@type": "City", name: "São Paulo" },
  { "@type": "Country", name: "Brasil" },
];

const hrefOf = (id) => social.find((s) => s.id === id)?.href;
// wa.me/5511... → +5511... (formato internacional que o schema.org espera)
const phoneFromWhatsapp = (url) => `+${url.split("/").pop()}`;

// Dados estruturados (schema.org): quem é, o que oferece e qual é o site
export function buildJsonLd() {
  const url = getSiteUrl();
  const personId = `${url}/#pessoa`;
  const sameAs = social.filter((s) => s.href?.startsWith("https://") && s.id !== "whatsapp").map((s) => s.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Welinton Carmelo",
        jobTitle: "Videomaker e estrategista de conteúdo",
        description: about.paragraphs[0],
        url,
        sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#servico`,
        name: "Welinton Carmelo · Videomaker",
        description: siteDescription,
        url,
        image: `${url}/opengraph-image`,
        telephone: phoneFromWhatsapp(hrefOf("whatsapp")),
        email: hrefOf("email")?.replace("mailto:", ""),
        areaServed: AREA_SERVED,
        founder: { "@id": personId },
        sameAs,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços",
          itemListElement: services.items.map(({ title, text }) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: title, description: text },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#site`,
        url,
        name: "Welinton Carmelo",
        inLanguage: "pt-BR",
        publisher: { "@id": personId },
      },
    ],
  };
}
