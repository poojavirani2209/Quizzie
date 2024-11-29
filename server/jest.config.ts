import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' for front-end testing
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  clearMocks: true, // Automatically clear mocks between every test
  collectCoverage: true, // Collect test coverage information
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Resolve @src paths for cleaner imports
  },
};
export default config;