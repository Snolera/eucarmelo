import { render } from "@testing-library/react";
import { siteDescription, siteTitle, buildJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { social, photos, work } from "@/content/site";
import JsonLd from "@/components/JsonLd/JsonLd";
import Home from "@/app/page";
import * as ogImage from "@/app/opengraph-image";
import * as twitterImage from "@/app/twitter-image";

const hrefOf = (id) => social.find((s) => s.id === id).href;
const words = (text) => text.trim().split(/\s+/).length;

describe("SEO: title e description", () => {
  test("title até 60 caracteres", () => {
    expect(siteTitle.length).toBeLessThanOrEqual(60);
  });

  // O Google corta perto de 160; abaixo de ~120 sobra espaço sem palavra-chave
  test("description entre 120 e 160 caracteres, com as palavras que o cliente busca", () => {
    expect(siteDescription.length).toBeGreaterThanOrEqual(120);
    expect(siteDescription.length).toBeLessThanOrEqual(160);
    expect(siteDescription).toMatch(/videomaker/i);
    expect(siteDescription).toMatch(/reels/i);
  });

  test("description com acentos (texto antigo vinha sem)", () => {
    expect(siteDescription).not.toMatch(/\bVideos\b|\bhistorias\b/);
  });
});

describe("SEO: JSON-LD (schema.org)", () => {
  const graph = buildJsonLd()["@graph"];
  const byType = (type) => graph.find((node) => node["@type"] === type);

  test("contexto schema.org com Person, ProfessionalService e WebSite", () => {
    expect(buildJsonLd()["@context"]).toBe("https://schema.org");
    ["Person", "ProfessionalService", "WebSite"].forEach((type) => expect(byType(type)).toBeDefined());
  });

  test("Person: nome, função e redes vindas do site.js", () => {
    const person = byType("Person");
    expect(person.name).toBe("Welinton Carmelo");
    expect(person.jobTitle).toMatch(/videomaker/i);
    expect(person.sameAs).toEqual(expect.arrayContaining([hrefOf("instagram"), hrefOf("tiktok")]));
  });

  test("ProfessionalService: URL oficial, telefone do WhatsApp, área atendida e serviços", () => {
    const business = byType("ProfessionalService");
    expect(business.url).toBe(SITE_URL);
    expect(business.telephone).toBe("+5511981685510");
    expect(business.areaServed).toBeDefined();
    expect(business.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
  });

  test("componente escreve um <script type=application/ld+json> com < escapado (anti-XSS)", () => {
    const { container } = render(<JsonLd data={{ name: "</script><b>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script.innerHTML).not.toContain("<");
    expect(JSON.parse(script.innerHTML).name).toBe("</script><b>");
  });

  test("a home publica o JSON-LD", () => {
    const { container } = render(<Home />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script.innerHTML)["@graph"]).toHaveLength(graph.length);
  });
});

describe("SEO: imagem de compartilhamento", () => {
  test("Open Graph em 1200x630 PNG com texto alternativo", () => {
    expect(ogImage.size).toEqual({ width: 1200, height: 630 });
    expect(ogImage.contentType).toBe("image/png");
    expect(ogImage.alt).toMatch(/Welinton Carmelo/);
  });

  test("Twitter Card usa a mesma imagem", () => {
    expect(twitterImage.size).toEqual(ogImage.size);
    expect(twitterImage.alt).toBe(ogImage.alt);
    expect(twitterImage.default).toBe(ogImage.default);
  });
});

describe("SEO: textos alternativos", () => {
  test("fotos: alt descritivo (4+ palavras) e legenda curta (1 palavra), sem repetir", () => {
    photos.items.forEach(({ alt, caption }) => {
      expect(words(alt)).toBeGreaterThanOrEqual(4);
      expect(words(caption)).toBe(1);
    });
    expect(new Set(photos.items.map((p) => p.alt)).size).toBe(photos.items.length);
    expect(new Set(photos.items.map((p) => p.caption)).size).toBe(photos.items.length);
  });

  test("capas do Portfólio: alt descritivo (4+ palavras) e sem repetir", () => {
    work.items.forEach(({ alt }) => expect(words(alt)).toBeGreaterThanOrEqual(4));
    expect(new Set(work.items.map((w) => w.alt)).size).toBe(work.items.length);
  });
});
