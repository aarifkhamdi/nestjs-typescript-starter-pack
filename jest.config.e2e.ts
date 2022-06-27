import jestConfig from './jest.config';

// eslint-disable-next-line import/no-unused-modules
export default {
  ...jestConfig,
  globalSetup: './test/util/jest.e2e.global-setup.ts',
};
