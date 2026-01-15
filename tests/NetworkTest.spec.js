import { test, expect, request } from '@playwright/test';
import { APIUtils } from './utils/APIUtils';

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
            productOrderedId: "68a961959320a140fe1ca57e"
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