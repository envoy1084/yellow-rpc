import { fileURLToPath } from "node:url";

import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(async ({ mode }) => {
  // @ts-expect-error assign read-only env for build, load all env vars
  import.meta.env = loadEnv(mode, process.cwd(), "");
  await import("./src/env");
  return {
    envPrefix: ["VITE_"],
    plugins: [
      nodePolyfills(),
      devtools(),
      tanstackRouter({
        autoCodeSplitting: true,
        generatedRouteTree: "./src/route-tree.gen.ts",
        quoteStyle: "double",
        routeFileIgnorePrefix: "-",
        routesDirectory: "./src/app",
        routeTreeFileHeader: [
          "/** biome-ignore-all lint/style/useNamingConvention: safe */",
          "/** biome-ignore-all lint/suspicious/noExplicitAny: safe  */",
          "// @ts-nocheck",
        ],
        semicolons: true,
        target: "react",
      }),
      react(),
      tailwindcss(),
    ],
    publicDir: "public",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: { port: 3000 },
  };
});
