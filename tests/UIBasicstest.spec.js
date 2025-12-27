const { test, expect, chromium } = require('@playwright/test');
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

test('006TC: Handling radio buttons', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // radio button
    await page.locator('.radiotextsty').last().click();

    // pop-up
    await page.locator('#okayBtn').click();

    // assertion: toBeChecked()
    await expect(page.locator('.radiotextsty').last()).toBeChecked();

    // assertion: isChecked: returns boolean value
    const ischecked = await page.locator('.radiotextsty').last().isChecked();
    expect(ischecked).toBeTruthy();
});

test('007TC: Handling checkboxes', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // checkbox locator
    const checkBox = page.locator('#terms');

    // click() just toggles
    // check() -BEST PRACTICE
    /***
     * Ensures the checkbox ends up checked
     * If already checked → does nothing
     * If unchecked → checks it
     * Waits for checkbox to be visible, enabled, and stable
     * Fails if the element is not a checkbox
     */
    await checkBox.check();
    console.log("checkBox is checked");

    // assertion: toBeChecked()
    await expect(checkBox).toBeChecked();
    console.log("checked assertion passed");

    // uncheck()
    await checkBox.uncheck();
    console.log("checkBox is unchecked");

    // assertion: isChecked: returns boolean value
    const ischecked = await checkBox.isChecked();
    expect(ischecked).toBeFalsy();
    console.log("uncheck assertion passed");
});

test('008TC: Blinking text assertion', async ({ page }) => { 
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Blinking text locator
    const blinkingText = page.locator("[href*='documents-req']");

    // assertion - toHaveAttribute()
    await expect(blinkingText).toHaveAttribute('class', 'blinkingText');
    console.log("blinkingText assertion passed");
});

test('009TC: Handling child windows', async () => { 
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Blinking text locator
    const blinkingLink = page.locator("[href*='documents-req']");
    
    // Before clicking, inform about wait for an event of new page.
    const [childPage] = await Promise.all([ context.waitForEvent('page'), blinkingLink.click() ]);  // run asyn steps until all promises are fulfilled
    
    // child page
    const text = await childPage.locator('p.red').textContent();
    console.log(text);
    const userName = text.split("@")[1].split(".")[0];
    console.log("userName: " + userName);
    await childPage.waitForTimeout(2000);
    await childPage.close();

    // parent
    await page.locator('#username').fill(userName);
    await page.waitForTimeout(2000);
    // inputValue example -START
    const enteredText = await page.locator('#username').inputValue(); 
    expect(enteredText).toEqual(userName);
    console.log("usernames matched");
    // inputValue example - END
    await page.locator('input[type="password"]').fill('learning');
    await page.waitForTimeout(2000);
    await page.locator('#signInBtn').click();
    await page.waitForTimeout(5000);
    
    await expect(page).toHaveTitle("ProtoCommerce");
    console.log("login successful");
});

test('010TC: Playwright special locators', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    //getByLabel
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByLabel("Employed").check();

    await page.getByPlaceholder("Password").fill("asdf"); // getByPlaceholder

    await page.getByRole("button", { name: "Submit" }).click(); // getByRole

    expect(await page.getByText("Success! The Form has been submitted successfully!.").isVisible()).toBeTruthy();    // getByText

    await page.getByRole("link", { name: "Shop" }).click(); // getByRole

    await page.locator("app-card").filter({hasText: "Nokia"}).getByRole("button").click();  // filter, getByRole
});

test('011TC: Handling Calendar', async ({ page }) => {
    const month = "06";
    const date = "15";
    const year = "2027";
    const expectedList = [month, date, year];

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();

    // assert
    const actualDate = await page.locator(".react-date-picker__inputGroup input[name='date']").getAttribute('value');
    const expectedDate = year+"-"+month+"-"+date;
    expect(actualDate).toEqual(expectedDate);
    console.log("PASS: " + expectedDate);

    // const inputs = page.locator(".react-date-picker__inputGroup input");
    // for(let i=1; i<=expectedList.length; i++){
    //     expect(await inputs.nth(i).inputValue()).toEqual(expectedList[i-1]);
    // }
    // console.log("done");
});

test('012TC: More UI validations', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // await page.goto("https://google.com");
    // await page.goBack();
    // await page.goForward();

    // toBeVisible
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    // toBeHidden
    // expect(await page.locator("#displayed-text").isVisible()).toBeFalsy();
    await expect(page.locator("#displayed-text")).toBeHidden();
});