import { Cormorant_Garamond, Lora, Space_Grotesk } from "next/font/google";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

// Fontes do design (títulos e corpo), expostas como variáveis CSS
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Títulos H1/H2: fonte variável, um arquivo cobre 300 (light) a 700 (bold)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const title = "Welinton Carmelo · Videomaker para Instagram";
const description =
  "Reels e stories gravados no celular para marcas que vivem no feed. Fale com @eucarmelo pelo direct do Instagram.";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Welinton Carmelo",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${lora.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
