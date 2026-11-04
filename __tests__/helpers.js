import { parseEmphasis } from "@/components/SectionHeading/SectionHeading";

// Nome acessível de um título do site.js: sem os asteriscos, com a quebra de linha virando espaço
// Ex.: "A forma *importa.*\n A intenção" → "A forma importa. A intenção"
export const headingName = (title) =>
  parseEmphasis(title)
    .map((part) => (part.type === "br" ? " " : part.value))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
