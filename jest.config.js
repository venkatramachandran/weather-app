module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'output/coverage/jest',
  collectCoverage: true,
  testMatch: ['**/*.test.ts']
};