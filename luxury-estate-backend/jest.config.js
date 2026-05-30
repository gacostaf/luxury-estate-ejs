// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  // Run tests serially — all tests share a single database and parallel execution
  // causes race conditions (FK violations, email collisions, data contamination).
  maxWorkers: 1,
  // Silence React 19 peer dependency warnings from swagger-ui-react
  silent: true,
};

module.exports = createJestConfig(customJestConfig);