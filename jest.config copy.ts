// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    // CSS/SCSS Modules → identity-obj-proxy
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Aliases do Next.js
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'json', 'html'],
};

export default config;
