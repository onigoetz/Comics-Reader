import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart({
      // The app is hosted by our own Express server (server/index.js) which
      // runs Vite in middleware mode during development
      vite: { installDevServerMiddleware: true }
    }),
    viteReact()
  ]
});
