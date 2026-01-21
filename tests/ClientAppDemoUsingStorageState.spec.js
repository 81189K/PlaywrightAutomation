import { test, expect } from '@playwright/test';

let webContext;
const requiredProduct = "ADIDAS ORIGINAL";

test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('testerfour@email.com');
    await page.locator('#userPassword').fill('testerFour4');
    await page.locator('#login').click();
    // await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();
    await context.storageState({path: 'data/state.json'});
    webContext = await browser.newContext({storageState: 'data/state.json'});
});

test('@smoke 001TC: Client App E2E flow1 using storageState()', async () => { 
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');

    // locator variables, for reuse.
    const cardTitles = page.locator('.card-body b');
    const titles = await cardTitles.allTextContents();
    console.log("001TC: All Items: "+ titles);
});

test('002TC: Client App E2E flow', async () => { 
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');

    // locator variables, for reuse.
    const products = page.locator('.card-body');

    // add to cart
    const productsCount = await products.count(); // Returns the number of elements matching the locator.
    for(let i=0; i<productsCount; i++){
        const productName = await products.nth(i).locator('b').textContent(); // locator chaining
        if(productName == requiredProduct){
            await products.nth(i).locator('text= Add To Cart').click(); // text based locator
            break;
        }
    }
    console.log(requiredProduct + " is added to cart");

    // locator variables, for reuse.
    const emaiID = 'testerfour@email.com';

    // My Cart
    await page.locator("button[routerlink='/dashboard/cart']").click();
    //wait for items to load
    await page.locator(".cart li").first().waitFor();
    const isPresentInCart = await page.locator("h3:has-text('"+requiredProduct+"')").isVisible();   // sudo class
    expect(isPresentInCart).toBeTruthy();

    //Checkout
    await page.locator(".subtotal button").click();

    // Handling auto suggestive dropdown
    await page.locator("[placeholder='Select Country']").pressSequentially("ind", {delay: 150});  // enters i → (delay 150ms) → enters n → (delay 150ms) → enters d
    const dropdown = page.locator("section.ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for(let i=0; i<optionsCount; i++){
        const option = (await dropdown.locator("span").nth(i).innerText()).trim();  // innerText() returns string; textContent() returns string | null (req extra null check)
        if(option === "India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    // assert email id
    await expect(page.locator(".user__name label")).toHaveText(emaiID);   // toHaveText()

    // place order btn
    await page.locator(".action__submit").click();
    // assert Thankyou msg
    await expect(page.locator(".hero-primary")).toContainText("Thankyou");

    let orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log("Placed order with order id: "+ orderID);

    // My Orders
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.locator("tbody").waitFor();
    const orders = page.locator("tbody tr");
    for(let i=0; i< await orders.count(); i++){
        const currentOrderID = await orders.nth(i).locator("th").textContent();
        if(orderID.includes(currentOrderID)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }

    expect(orderID).toContain(await page.locator("div.col-text").textContent());
    console.log("TEST PASSED");
});