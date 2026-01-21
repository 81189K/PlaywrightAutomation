import { test, expect } from '@playwright/test';
import POManager from '../pageObjects/POManager';
var testData = require("../data/clientAppPODataParameterizationTestData.json");

for (const data of testData) {
    test(`@smoke Client App E2E flow - for ${data.requiredProduct}`, async ({ page }) => {
        // variables
        const emailID = data.emailID;
        const password = data.password
        const requiredProduct = data.requiredProduct;

        const app = new POManager(page);
        // LoginPage
        await app.getLoginPage().goToLandingURL();
        await app.getLoginPage().validLogin(emailID, password);

        // DashboardPage
        await app.getDashboardPage().waitForProductsToLoad();
        await app.getDashboardPage().addProductToCart(requiredProduct);
        await app.getDashboardPage().navigateToCart();

        // CartPage
        const isPresentInCart = await app.getCartPage().isProductPresentInCart(requiredProduct);
        expect(isPresentInCart).toBeTruthy();
        await app.getCartPage().checkOut(); //Checkout

        // OrdersPage
        const ordersPage = app.getOrdersPage();
        await ordersPage.selectCountry("India", "ind");
        await ordersPage.verifyUserEmail(emailID);
        await ordersPage.placeOrder();

        // OrderConfirmationPage
        const orderConfirmationPage = app.getOrderConfirmationPage();
        await orderConfirmationPage.verifyOrderConfirmationMessage('Thankyou');
        const orderID = await orderConfirmationPage.getOrderID();
        await orderConfirmationPage.goToMyOrders(); // My Orders

        // MyOrdersPage
        const myOrdersPage = app.getMyOrdersPage();
        await myOrdersPage.viewOrderDetails(orderID);
        await myOrdersPage.verifyOrderID(orderID);
        console.log("TEST PASSED");
    });
}
