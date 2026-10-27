import nextConfig, { BLOB_HOST } from "../next.config.mjs";
import { about, hero, work } from "@/content/site";

// Vídeos e pôsteres ficam no Vercel Blob (store público); null = ainda não enviado
// Caminhos locais ("/retrato.jpg", da pasta public/) também valem
const media = [
  hero.showreel.src,
  hero.showreel.poster,
  about.portrait.src,
  ...work.items.flatMap((item) => [item.src, item.poster]),
].filter((url) => url?.startsWith("http"));

describe("URLs do Vercel Blob", () => {
  test("next/image aceita imagens do store público, só por https", () => {
    expect(nextConfig.images.remotePatterns).toContainEqual(
      expect.objectContaining({ protocol: "https", hostname: BLOB_HOST })
    );
  });

  test("toda mídia externa no site.js aponta para o store do projeto", () => {
    media.forEach((url) => expect(new URL(url).hostname).toBe(BLOB_HOST));
  });
});
