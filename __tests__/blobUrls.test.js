import nextConfig, { BLOB_HOST } from "../next.config.mjs";
import { about, hero, photos, work } from "@/content/site";

// Vídeos ficam no Vercel Blob (store público); null = ainda não enviado
// Fotos são imports locais (content/media): objetos, não URLs, então ficam fora desta checagem
// Placeholders do portfólio (picsum e vídeo de exemplo da MDN) valem até o conteúdo real entrar
const PLACEHOLDER_HOSTS = ["picsum.photos", "interactive-examples.mdn.mozilla.net"];
const media = [
  hero.showreel.src,
  hero.showreel.poster,
  about.portrait.src,
  ...work.items.flatMap((item) => [item.image, item.video]),
  ...photos.items.map((item) => item.image),
].filter((url) => typeof url === "string" && url.startsWith("http"));

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
