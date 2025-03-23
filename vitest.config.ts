import { defineConfig } from "vitest/config";

const root = import.meta.dirname;
export default defineConfig({
  esbuild: { target: "es2022" },
  test: {
    alias: [
      { find: /^@asla\/wokao$/, replacement: root + "/src/mod.ts" },
    ],
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
