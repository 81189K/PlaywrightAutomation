import { test, expect, request } from '@playwright/test';

let loginToken;
const loginPayload = {
    userEmail: "testerone@email.com",
    userPassword: "testerOne1"
}

test.beforeAll(async () => {
    const APIcontext = await request.newContext({
        ignoreHTTPSErrors: true,   // to avoid SSL/certificate related errors, Tell Playwright to ignore HTTPS errors when creating the API context.
    });
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
    expect((loginResponse).ok()).toBeTruthy();
    const loginResponseJSON = await loginResponse.json();
    loginToken = loginResponseJSON.token;
    console.log(loginToken);
});