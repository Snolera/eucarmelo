import { Barlow, Barlow_Condensed, Cormorant_Garamond, Inter, Lora, Space_Grotesk } from "next/font/google";
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

// Galeria 9:16 (Trabalhos): Barlow no texto, Barlow Condensed nos títulos e números
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// Logo do header: "welinton" light (300) + "carmelo" negrito (700)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
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
    <html lang="pt-BR" className={`${cormorant.variable} ${lora.variable} ${spaceGrotesk.variable} ${barlow.variable} ${barlowCondensed.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
