import { expect } from '@playwright/test';

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.orderConfirmationMessage = page.locator('.hero-primary'); // thankyou message
        this.orderIdLabel = page.locator('.em-spacer-1 .ng-star-inserted'); // Order ID
        this.myOrdersBtn = page.locator("button[routerlink='/dashboard/myorders']"); // My Orders
    }

    async verifyOrderConfirmationMessage(text) {
        await expect(this.orderConfirmationMessage).toContainText(text);
    }

    async getOrderID() {
        return (await this.orderIdLabel.textContent()).trim();
    }

    async goToMyOrders() {
        await this.myOrdersBtn.click();
        // Optional: wait for My Orders page to load (e.g., table)
        await this.page.locator('tbody').waitFor({ state: 'visible' });
    }
}

export default OrderConfirmationPage;
