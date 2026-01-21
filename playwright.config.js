// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  retries: 1,
  timeout: 40 * 1000, // 40 seconds, default is 30 seconds
  expect: {
    timeout: 10000 // 10 seconds, default is 5 seconds
  },
  reporter: 'html',
 
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // viewport: null, // Disable viewport (true window size)
    // launchOptions: {
    //   args: ['--start-maximized'], // a Chromium flag. Instructs the browser to start maximized at OS level. Works for: CR, Edge. Not supported by Firefox/WebKit. ** Ignored in headless mode. Not reliable in CI unless you tightly control display size
    // },
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    // browserName: 'firefox',
    screenshot: 'on',
    trace: 'retain-on-failure', // on, off
    headless: false, // by default, its true. Explicitly making it as false
    viewport: {width:1080, height:720} // use for web responsive testing
  },


});

