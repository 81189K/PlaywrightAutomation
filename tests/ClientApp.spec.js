const { test, expect } = require('@playwright/test');

test('First Testcase: Client App login', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/client');
    const pageTitle = await page.title();
    console.log("Page Title is: " + pageTitle);

    // locator variables, for reuse.
    const email = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const login = page.locator('#login');
    const cardTitles = page.locator('.card-body b');

    // login
    await email.fill('testerone@email.com');
    await password.fill('testerOne1');
    await login.click();

    // explicitly handling page contents load sync for allTextContents()

    //M1: DISCOURAGED - could be flaky
    // wait until the network comes to idle state. i.e., all REST service calls are completed.
    // await page.waitForLoadState('networkidle'); // COULD BE FLAKY

    //M2:
    // waitFor() waits for single element; so using first()
    await cardTitles.first().waitFor(); // waits for specified element is loaded on the page.

    // now, allTextContents() will run only after the page contents are loaded.
    console.log(await cardTitles.allTextContents());    
});
