import { expect } from '@playwright/test';

class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayload
            }
        );
        /***
         * response.ok() 
         * ✅ Returns true if the HTTP status code is 200–299
         * ❌ Returns false for 400, 500, etc.
         */
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJSON = await loginResponse.json();
        return loginResponseJSON.token;
    }

    async createOrder(orderPayload) {
        let jsObject = {}; // empty javascript object
        jsObject.loginToken = await this.getToken();    // add loginToken property to response javascript object
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': jsObject.loginToken,
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(orderResponse.ok()).toBeTruthy();
        const orderResponseJSON = await orderResponse.json();
        jsObject.orderID = orderResponseJSON.orders[0]; // add orderID property to response javascript object
        return jsObject;
    }

}

module.exports = {APIUtils};