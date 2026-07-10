module.exports = {
  // Use jsdom to simulate a browser environment for DOM-related tests
  testEnvironment: "jest-environment-jsdom",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Configure coverage reporters to output human-readable, web-readable, and JSON-summary outputs
  coverageReporters: ["text", "lcov", "json-summary"],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app.js", // Exclude the main app UI file from coverage calculations as it mainly ties DOM events
    "!src/style.css"
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFiles: [],

  // Ensure Jest finds our test files correctly
  testMatch: [
    "**/tests/**/*.test.js"
  ]
};
