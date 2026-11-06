// Domínio oficial (com www, sem barra final): base do canonical, Open Graph, sitemap e robots
export const SITE_URL = "https://www.welintoncarmelo.com.br";

// NEXT_PUBLIC_SITE_URL sobrescreve; previews da Vercel também apontam para o domínio oficial
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
}
