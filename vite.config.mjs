import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import autoprefixer from "autoprefixer";
import envCompatible from "vite-plugin-env-compatible";
export default defineConfig(() => {
  return {
    base: "/",
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 5000,
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },

    envPrefix: "REACT_APP_",
    plugins: [react(), envCompatible()],
    resolve: {
      alias: [
        {
          find: "src/",
          replacement: `${path.resolve(__dirname, "src")}/`,
        },
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"],
    },
    assetsInclude: ["**/*.riv"],
    server: {
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  };
});
