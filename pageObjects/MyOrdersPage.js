import { expect } from '@playwright/test';

class MyOrdersPage {

    constructor(page) {
        this.page = page;
        // Locators
        this.ordersRows = page.locator("tbody tr");
        this.orderDetailsText = page.locator("div.col-text");
    }

    /**
     * Clicks the "View Details" button for the given order ID
     * @param {string} orderID - The order ID to search for
     */
    async viewOrderDetails(orderID) {
        const rowCount = await this.ordersRows.count();
        for (let i = 0; i < rowCount; i++) {
            const currentOrderID = (await this.ordersRows.nth(i).locator("th").textContent())?.trim();
            if (orderID.includes(currentOrderID)) {
                await this.ordersRows.nth(i).locator("button").first().click();
                break;
            }
        }
    }

    /**
     * Assert that the displayed order ID matches the expected order ID
     * @param {string} orderID - The order ID to verify
     */
    async verifyOrderID(orderID) {
        const displayedOrderID = (await this.orderDetailsText.textContent())?.trim();
        expect(orderID).toContain(displayedOrderID);
    }
}

export default MyOrdersPage;
