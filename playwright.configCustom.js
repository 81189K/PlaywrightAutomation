// @ts-check
import { defineConfig, devices } from '@playwright/test';

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
      name: 'safari-desktop',
      use: {
        browserName: 'webkit',
        headless: false,
        ignoreHTTPSErrors: true,
        screenshot: 'on',
        trace: 'retain-on-failure'
      }
    },
    {

      name: 'safari-mobile',
      use: {
        browserName: 'webkit',
        headless: false,
        ...devices['iPhone 14 Pro Max'],
        screenshot: 'on',
        trace: 'retain-on-failure'
      }
    },
    {
      name: 'chrome',
      use: {
        ignoreHTTPSErrors: true,
        browserName: 'chromium',
        screenshot: 'on',
        trace: 'retain-on-failure', // on, off
        headless: false,
        viewport: {width:1080, height:720} // use for web responsive testing
      },
    }, 
    {
      name: 'location-blocked',
      use: {
        permissions: []
      }
    },
    {
      name: 'location-allowed',
      use: {
        permissions: ['geolocation'],
        geolocation: { latitude: 12.97, longitude: 77.59 }
      }
    }

  ]
  


});

//torun:
// npx playwright test tests/ClientAppPODataParameterization.spec.js --config playwright.configCustom.js
// npx playwright test tests/ClientAppPODataParameterization.spec.js --config playwright.configCustom.js --project=safari-desktop

// if --project option is not specified, runs with all project configurations.