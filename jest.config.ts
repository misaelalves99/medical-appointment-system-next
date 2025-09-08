// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // Arquivo de setup (importa jest-dom, etc.)
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    // CSS/SCSS Modules → identity-obj-proxy
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // Aliases do Next.js (import '@/...') → src/...
    "^@/(.*)$": "<rootDir>/src/$1",

    // Mock para next/navigation (evita erro em hooks/pages do Next 13+)
    "^next/navigation$": "<rootDir>/__mocks__/next/navigation.ts",
  },

  // Coverage configurado
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "json", "html"],
};

export default config;
