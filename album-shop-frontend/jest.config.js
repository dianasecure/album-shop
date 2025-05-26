module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transform JSX/ES6 syntax
    },
  };

module.exports = {
  collectCoverage: true, 
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text", "lcov", "clover"],
    testEnvironment: 'jsdom',
    testMatch: [
      '<rootDir>/src/app/__tests__/**/*.(test|spec).{js,jsx,ts,tsx}',
      // Or if you use testRegex
      // 'src/app/__test__/.+\\.(test|spec)\\.(js|jsx|ts|tsx)$',
    ],
  };
  
  
  