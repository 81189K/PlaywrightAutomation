import { test, expect } from '@playwright/test';
import POManager from '../pageObjects/POManager';
var testData = require("../data/clientAppPOTestData.json");


test('001TC: Client App E2E flow - Page Object Pattern Implementation', async ({page}) => {
    // variables
    const emailID = testData.emailID;
    const password = testData.password
    const requiredProduct = testData.requiredProduct;

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