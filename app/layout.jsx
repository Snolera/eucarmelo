import { Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

// Texto do site, H1 e números: fonte variável, um arquivo cobre 300 (light) a 700 (bold)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Logo, H2 das seções, pílulas e cards: light (300), regular (400) e negrito (700)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

// Palavras em destaque nos H2 ("Por trás de *cada* projeto"): só o itálico 700
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "700",
  style: "italic",
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
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
