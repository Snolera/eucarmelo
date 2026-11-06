import { afterEach, describe, expect, test, vi } from "vitest";
import { SITE_URL, getSiteUrl } from "@/lib/siteUrl";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  test("domínio próprio com www, https e sem barra no final", () => {
    expect(SITE_URL).toBe("https://www.welintoncarmelo.com.br");
  });

  test("usa o domínio próprio mesmo com a URL .vercel.app da Vercel", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "eucarmelo-q1vo.vercel.app");
    expect(getSiteUrl()).toBe(SITE_URL);
  });

  test("NEXT_PUBLIC_SITE_URL tem prioridade", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://outro.com.br");
    expect(getSiteUrl()).toBe("https://outro.com.br");
  });
});
