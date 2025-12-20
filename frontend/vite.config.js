import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const devPort = Number(env.VITE_DEV_PORT || 5173);
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:8000";

  return {
    plugins: [react()],
    server: {
      port: devPort,
      proxy: {
        "/api": { target: backendUrl, changeOrigin: true, secure: false },
        "/admin": { target: backendUrl, changeOrigin: true, secure: false },
        "/uploads": { target: backendUrl, changeOrigin: true, secure: false },
      },
    },
  };
});
