import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import imageSizeLib from "next/dist/compiled/image-size/index.js";

const { imageSize } = imageSizeLib;

// Imita o import estático de imagem do Next ({ src, width, height, blurDataURL }); o Vite daria só uma string
const nextStaticImage = {
  name: "next-static-image",
  enforce: "pre",
  load(id) {
    const file = id.split("?")[0];
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) return null;
    const { width, height } = imageSize(readFileSync(file));
    const blurDataURL = "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==";
    return `export default ${JSON.stringify({ src: `/${basename(file)}`, width, height, blurDataURL })};`;
  },
};

export default defineConfig({
  plugins: [nextStaticImage, react()],
  resolve: {
    // Mesmo alias do jsconfig.json (@/components/...)
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
