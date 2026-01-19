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
        let orderDetails = {}; // empty javascript object (to return two values)
        orderDetails.loginToken = await this.getToken();    // add loginToken property to orderDetails javascript object
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': orderDetails.loginToken,
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(orderResponse.ok()).toBeTruthy();
        const orderResponseJSON = await orderResponse.json();
        orderDetails.orderID = orderResponseJSON.orders[0]; // add orderID property to orderDetails javascript object
        return orderDetails; // return the javascript object, which has loginToken and created order ID.
    }

}

module.exports = {APIUtils};