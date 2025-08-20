import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ""), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
        },
        // Incoming webhooks: 8 alphanumeric chars + /webhook/ + slug
        "^/[a-zA-Z0-9]{8}/webhook/[a-z0-9-]+$": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
