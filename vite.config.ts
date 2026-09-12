import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
      },
      manifest: {
        name: "QA Toolkit",
        short_name: "QA Toolkit",
        description: "Refinamento, boas práticas de qualidade e construtor de testes Playwright — sem backend.",
        theme_color: "#4f46e5",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
