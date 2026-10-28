import nextConfig, { BLOB_HOST } from "../next.config.mjs";
import { about, hero, work } from "@/content/site";

// Vídeos e pôsteres ficam no Vercel Blob (store público); null = ainda não enviado
// Caminhos locais ("/retrato.jpg", da pasta public/) também valem
// Placeholders da galeria (picsum e vídeo de exemplo da MDN) valem até o conteúdo real entrar
const PLACEHOLDER_HOSTS = ["picsum.photos", "interactive-examples.mdn.mozilla.net"];
const media = [
  hero.showreel.src,
  hero.showreel.poster,
  about.portrait.src,
  ...work.items.flatMap((item) => [item.image, item.video]),
].filter((url) => url?.startsWith("http"));

describe("URLs do Vercel Blob", () => {
  test("next/image aceita imagens do store público, só por https", () => {
    expect(nextConfig.images.remotePatterns).toContainEqual(
      expect.objectContaining({ protocol: "https", hostname: BLOB_HOST })
    );
  });

  test("toda mídia externa no site.js aponta para o store do projeto", () => {
    media.forEach((url) => expect([BLOB_HOST, ...PLACEHOLDER_HOSTS]).toContain(new URL(url).hostname));
  });
});
