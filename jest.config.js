const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/server/(.*)$": "<rootDir>/src/server/$1",
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(config);
