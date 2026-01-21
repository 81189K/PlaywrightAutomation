import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../utils/APIUtils';

let createdOrderDetails = {};
let fakeEmptyResponsePayload = { data: [], message: "No Orders" };
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
        // can be configured in playwright.config.js file as well, which applies to all scripts.
    });

    // order API (login handled within createorder() )
    const apiUtils = new APIUtils(apiContext, loginPayload);
    createdOrderDetails = await apiUtils.createOrder(orderPayload);
    console.log("Order id: "+ createdOrderDetails.orderID); // though order is created, it will not be displayed on orders page.
});

test('001TC: Intercepted network response calls with playwright route() method', async ({ page }) => {
    // set token in localStorage
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, createdOrderDetails.loginToken);

    await page.goto('https://rahulshettyacademy.com/client');

    // Routing provides the capability to modify network requests that are made by a page.
    // 1. Calling API and overriding the response body
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            //intercepting the response
                // API response > {inject fake response} > pass it to browser > render on front end
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakeEmptyResponsePayload);    // expecting JSON format (converting js object to JSON)
            await route.fulfill({
                response,
                body
            }); // fulfill(): to modify API Response
        }
    );

    // 2. Setting API body without calling the API
    // await page.route(
    //     "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    //     async route => {
    //         route.fulfill({
    //             status: 200,
    //             contentType: 'application/json',
    //             body: JSON.stringify(fakeEmptyResponsePayload),
    //         });
    //     }
    // );
    

    // My Orders
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    // await page.pause();
    // await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log("Successfully intercepted network response calls with playwright route() method.");
    await expect(page.locator('.mt-4')).toContainText('No Orders');
    console.log(await page.locator(".mt-4").textContent());
});

test('002TC: Security test for network request intercept', async ({ page }) => {
    // set token in localStorage
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, createdOrderDetails.loginToken);

    await page.goto('https://rahulshettyacademy.com/client');
    
    // My Orders
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    
    // Intercept the Request
    // Refer: https://playwright.dev/docs/api/class-route
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue( // continue(): to intercept/modify API request calls(headers, url,...)
            { 
                url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=asdf1234' // wrong ID
            })
    );

    // View button
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
    console.log("Successfully intercepted network request url with playwright route() method.");
});

test('003TC: Abort Network calls', async ({ page }) => { 
    await page.setViewportSize({ width: 1920, height: 1080 }); // Run with specified dimensions: Deterministic, CI-friendly, Cross-browser stable
    // can configure the same in config.js file
    // ***NOTE: page.setViewportSize can override config defaults per-test.
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // locator variables, for reuse.
    const username = page.locator('#username');
    const password = page.locator('input[type="password"]');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');

    //abort
    page.route('**/*.{jpg, png, jpeg}', route => route.abort()); //**/*.{jpg, png, jpeg} --any url ending with given extensions

    // page.on('request', request=> console.log("REQUEST: "+ request.url()));   // log all request call urls
    // page.on('response', response=> console.log("RESPONSE: "+ response.url(), response.status()));   // log all response call urls & response status codes

    // login
    const userName = await page.locator(".text-center b").first().textContent();
    const pwd = await page.locator(".text-center b").last().textContent();
    await username.fill(userName);
    await password.fill(pwd);
    await signIn.click();
    await page.locator(".card-title").first().waitFor();
    const milliseconds = Date.now();    // Unix Epoch time in milliseconds
    await page.screenshot({path: `screenshots/screenshot_${milliseconds}.png`});
    console.log("Successfully aborted network calls ending with {jpg, png, jpeg} extensions");   // loaded page without product images.
});