import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    globals: false,
    // Default to node for pure calc tests; individual DOM tests opt in with
    // /* @vitest-environment jsdom */ at the top of the file.
    environment: "node",
    setupFiles: ["./src/test/a11y-setup.ts"],
  },
});
