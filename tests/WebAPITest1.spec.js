import { test, expect, request } from '@playwright/test';
import { APIUtils } from './utils/APIUtils';

let createdOrderDetails = {};
const loginPayload = {
    userEmail: "testerone@email.com",
    userPassword: "testerOne1"
}
const orderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
}

test.beforeAll(async () => {
    const apiContext = await request.newContext({
        ignoreHTTPSErrors: true,   // to avoid SSL/certificate related errors, Tell Playwright to ignore HTTPS errors when creating the API context.
    });

    // order API (login handled within createorder() )
    const apiUtils = new APIUtils(apiContext, loginPayload);
    createdOrderDetails = await apiUtils.createOrder(orderPayload);
    console.log("Order id: "+ createdOrderDetails.orderID);
});

test('First Testcase: Client App API test', async ({ page }) => {
    // set token in localStorage
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, createdOrderDetails.loginToken);

    await page.goto('https://rahulshettyacademy.com/client');
    // const pageTitle = await page.title();
    // console.log("Page Title is: " + pageTitle);

    // // locator variables, for reuse.
    // const cardTitles = page.locator('.card-body b');
    // console.log(await cardTitles.allTextContents());

    // My Orders
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    await page.locator("tbody").waitFor();
    const orders = page.locator("tbody tr");
    for(let i=0; i< await orders.count(); i++){
        const currentOrderID = await orders.nth(i).locator("th").textContent();
        if(createdOrderDetails.orderID.includes(currentOrderID)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    // assert orderID
    expect(createdOrderDetails.orderID).toContain(await page.locator("div.col-text").textContent());
    console.log("TEST PASSED");
});