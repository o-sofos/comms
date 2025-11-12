import { defineConfig } from "vitest/config";

export default defineConfig({
  // This tells Vite that our worker code is in ES Module format
  worker: {
    format: "es",
  },

  // This configures Vitest for our tests
  test: {
    /**
     * Use 'jsdom' to simulate a real browser environment (DOM, window)
     * This is essential for testing our renderer.
     */
    environment: "jsdom",
    /**
     * Automatically make 'describe', 'it', 'expect', etc.
     * available in all test files without importing them.
     */
    globals: true,

    coverage: {
      provider: "v8",
      enabled: true,
    },
  },
});
