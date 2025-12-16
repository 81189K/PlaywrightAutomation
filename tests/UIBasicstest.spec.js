const { test } = require('@playwright/test');
//Imports test function/annotation from Playwright test  module.

test('First Testcase: Browser Context Playwright test', async ({ browser }) => { //global fixture: browser, context, page (ensure to warp inside {})
    // in general terminologies fixers are nothing but a global variables which are available across
    const context = await browser.newContext(); //create a new incognito browser context based on playwright.config.js file
    const page = await context.newPage(); //create a new page in the incognito browser context
    await page.goto('https://www.saucedemo.com/');
});

test('Second Testcase: Page Fixture Playwright test', async ({ page }) => { 
    await page.goto('https://google.com/'); // creates a new page in default browser context
});
