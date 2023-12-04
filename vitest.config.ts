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
        all: true,
        enabled: true,
        include: ["src"],
        provider: "v8",
        reporter: ["html"],
        reportsDirectory: "./node_modules/.vitest/coverage",
      },
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
    },
  }),
);
