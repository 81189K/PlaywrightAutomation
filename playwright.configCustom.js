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

  projects: [ // to group diff configurations
    {
      name: 'safari',
      use: {
        ignoreHTTPSErrors: true,
        browserName: 'webkit',
        screenshot: 'on',
        trace: 'retain-on-failure', // on, off
        headless: true // by default, its true.
      },
    },
    {
      name: 'chrome',
      use: {
        ignoreHTTPSErrors: true,
        browserName: 'chromium',
        screenshot: 'on',
        trace: 'retain-on-failure', // on, off
        headless: false // by default, its true.
      },
    }
  ]
  


});

//torun:
// npx playwright test tests/ClientAppPODataParameterization.spec.js --config playwright.configCustom.js
// npx playwright test tests/ClientAppPODataParameterization.spec.js --config playwright.configCustom.js --project=safari

// if --project option is not specified, runs with all project configurations.