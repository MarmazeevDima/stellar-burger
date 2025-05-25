import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageProvider: "v8"
};

export default config;