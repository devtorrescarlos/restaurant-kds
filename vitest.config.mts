import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: "unit",
          environment: "jsdom",
          include: [
            "src/**/*.{test,spec}.?(c|m)[jt]s?(x)",
            "!src/**/*.integration.{test,spec}.?(c|m)[jt]s?(x)",
          ],
        },
      },
      {
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: "integration",
          environment: "node",
          include: ["src/**/*.integration.{test,spec}.?(c|m)[jt]s?(x)"],
        },
      },
    ],
  },
});
