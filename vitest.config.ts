/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "happy-dom",
      setupFiles: "./src/setupFile.ts",
      globals: true,
      coverage: {
        reporter: ["text", "json", "html"],
      },
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
    },
  }),
);
