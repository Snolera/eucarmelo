// Store público do Vercel Blob (store_Rm7Tmby09iTxGh0l): vídeos e pôsteres do site
// Confira no painel (aba Browser → copiar URL de um arquivo) se o domínio é este
export const BLOB_HOST = "rm7tmby09itxgh0l.public.blob.vercel-storage.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Só o nosso store: o next/image não otimiza imagens de outros domínios
    remotePatterns: [{ protocol: "https", hostname: BLOB_HOST, pathname: "/**" }],
  },
};

export default nextConfig;
