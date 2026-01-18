import { expect } from '@playwright/test';

class OrdersPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.countryInput = page.locator("[placeholder='Select Country']");
        this.countryDropdown = page.locator("section.ta-results");
        this.userNameLabel = page.locator(".user__name label");
        this.placeOrderBtn = page.locator(".action__submit");
    }

    /**
     * Select a country from auto-suggest dropdown
     * @param {string} countryName - e.g., "India"
     * @param {string} inputText - e.g., "ind"
     */
    async selectCountry(countryName, inputText) {
        // Type with delay to handle slow server responses
        await this.countryInput.pressSequentially(inputText, { delay: 150 });

        // Wait for dropdown results
        await this.countryDropdown.waitFor({ state: 'visible' });

        const optionsCount = await this.countryDropdown.locator('button').count();

        for (let i = 0; i < optionsCount; i++) {
            const optionText = (await this.countryDropdown.locator('span').nth(i).innerText()).trim();

            if (optionText === countryName) {
                await this.countryDropdown.locator('button').nth(i).click();
                break;
            }
        }
    }

    /**
     * Assert that the logged-in user's email matches the expected value
     * @param {string} email
     */
    async verifyUserEmail(email) {
        await expect(this.userNameLabel).toHaveText(email);
    }

    /**
     * Click the "Place Order" button
     */
    async placeOrder() {
        await this.placeOrderBtn.click();
    }
}

export default OrdersPage;