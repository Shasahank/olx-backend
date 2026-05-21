export default {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src/tests"],

  moduleFileExtensions: ["ts", "js"],

  testMatch: ["**/*.test.ts"],

  collectCoverage: true,

  coverageDirectory: "coverage",

  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
};
