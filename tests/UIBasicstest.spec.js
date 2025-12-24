const { test, expect } = require('@playwright/test');
//Imports test function/annotation from Playwright test  module.

test('First Testcase: Browser Context Playwright test', async ({ browser }) => { //global fixture: browser, context, page (ensure to warp inside {})
    // in general terminologies fixers are nothing but a global variables which are available across
    const context = await browser.newContext(); //create a new incognito browser context based on playwright.config.js file
    const page = await context.newPage(); //create a new page in the incognito browser context
    await page.goto('https://www.saucedemo.com/');
});

test('Second Testcase: Page Fixture Playwright test', async ({ page }) => { 
    await page.goto('https://google.com/'); // creates a new page in default browser context
    const pageTitle = await page.title();
    console.log("Page Title is: " + pageTitle);
    await expect(page).toHaveTitle("Google"); //Assertion to verify the page title contains 'Google'
});

test('Third Testcase: Locators: Invalid login', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const pageTitle = await page.title();
    console.log("Page Title is: " + pageTitle);
    
    // locator: selectors= css, xpath
    await page.locator('#username').fill('rahulshettyacademy1'); // type() is deprecated, so use: fill()
    await page.locator('input[type="password"]').fill('learning');
    await page.locator('#signInBtn').click();

    // auto-wait
    const errorMsg = await page.locator("[style*='block']").textContent();  // to extract text from an element: textContent()
    console.log(errorMsg);
    expect(errorMsg).toContain('Incorrect');  // 'await' has no effect on the type of this expression.
});

test('Fourth Testcase: Locators: Invalid+Valid login', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // locator variables, for reuse.
    const username = page.locator('#username');
    const password = page.locator('input[type="password"]');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');

    // Invalid login
    await username.fill('rahulshettyacademy1');
    await password.fill('learning');
    await signIn.click();
    // validate error msg
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');  // await expect(locator).toContainText("abc");

    await username.fill(""); // clears the username input field
    await username.fill('rahulshettyacademy');  // enter correct username
    await signIn.click();   // click signin

    console.log(await cardTitles.first().textContent());  // first web element
    console.log(await cardTitles.nth(1).textContent());   // second, third,.. use nth()
    console.log(await cardTitles.last().textContent());   // last web element

    // NOTE: textContent() will auto-wait for elements to load; allTextContents() does not have such auto-wait.
    // Reason: Array can be empty or can have elements.
    // Be catious while using allTextContents(), page could load, but the method immediately retuns empty array.
    console.log("\n" + await cardTitles.allTextContents());   // all web elements titles
});

test('005TC: Handling Static Dropdown', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // locator variables, for reuse.
    const dropdown = page.locator('select.form-control');
    dropdown.selectOption('consult');   // selects based on value attribute value

    // assert selection
    await expect(dropdown).toHaveValue('consult');
});
