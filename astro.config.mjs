import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  srcDir: "src",
  publicDir: "public",
  integrations: [tailwind()],
  site: "https://pokemon-tcg-gc.netlify.app",
});
