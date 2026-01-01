import { test, expect, request } from '@playwright/test';

let loginToken, orderID;
const loginPayload = {
    userEmail: "testerone@email.com",
    userPassword: "testerOne1"
}
const orderPayload = {
    orders: [
        {
            country: "Cuba",
            productOrderedId: "68a961959320a140fe1ca57e"
        }
    ]
}

test.beforeAll(async () => {
    const APIcontext = await request.newContext({
        ignoreHTTPSErrors: true,   // to avoid SSL/certificate related errors, Tell Playwright to ignore HTTPS errors when creating the API context.
    });

    // login API
    const loginResponse = await APIcontext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayload
        }
    );
    /***
     * response.ok() 
     * ✅ Returns true if the HTTP status code is 200–299
     * ❌ Returns false for 400, 500, etc.
     */
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJSON = await loginResponse.json();
    loginToken = loginResponseJSON.token;
    console.log(loginToken);

    // order API
    const orderResponse = await APIcontext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                'Authorization': loginToken,
                'Content-Type': 'application/json'
            }
        }
    );
    expect(orderResponse.ok()).toBeTruthy();
    const orderResponseJSON = await orderResponse.json();
    orderID = orderResponseJSON.orders[0];
    console.log("order ID: "+ orderID);
});

test('First Testcase: Client App API test', async ({ page }) => {
    // set token in localStorage
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, loginToken);

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
        if(orderID.includes(currentOrderID)){
            await orders.nth(i).locator("button").first().click();
            break;
        }
    }
    // assert orderID
    expect(orderID).toContain(await page.locator("div.col-text").textContent());
    console.log("TEST PASSED");
});