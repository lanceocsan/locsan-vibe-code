import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  test: {
    environment: "node",
    globals: false,
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@shared": resolve("./src/shared"),
      "@renderer": resolve("./src/renderer"),
    },
  },
});
