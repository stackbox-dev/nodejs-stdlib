module.exports = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  testEnvironment: "node",
  bail: 1,
  modulePaths: ["<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        isolatedModules: false,
        include: [],
      },
    ],
  },
};
