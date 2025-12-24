// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 40 * 1000, // 40 seconds, default is 30 seconds
  expect: {
    timeout: 10000 // 10 seconds, default is 5 seconds
  },
  reporter: 'html',
 
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // browserName: 'chromium'
    browserName: 'firefox'
  },


});

