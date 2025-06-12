// types/global.d.ts
/// <reference types="@testing-library/jest-dom" />

import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  // Extend Jest Matchers
  namespace jest {
    interface Matchers<R = void, T = {}>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }

  // Add global test variables
  const jest: typeof import('@jest/globals').jest;
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const test: typeof import('@jest/globals').test;
  const expect: typeof import('@jest/globals').expect;
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const afterAll: typeof import('@jest/globals').afterAll;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const jest: typeof import('@jest/globals').jest;
  
  // Add NodeJS global types
  namespace NodeJS {
    interface Global {
      jest: typeof jest;
    }
  }
}

// This is needed to make this file a module
export {};
