class CartPage{
    
    constructor(page){
        this.page = page;
        // Locators
        this.cartItems = page.locator(".cart li");
        this.checkOutBtn = page.locator(".subtotal button");
    }

    async waitForCartToLoad(){
        await this.cartItems.first().waitFor();
    }

    // get product locator
    productInCart(productName) {
        // return this.page.locator("h3:has-text('" + productName + "')"); // sudo class
        return this.page.locator('h3', { hasText: productName });
    }

    async isProductPresentInCart(productName) {
        await this.waitForCartToLoad();
        return await this.productInCart(productName).isVisible();
    }

    async checkOut(){
        await this.checkOutBtn.click();
    }

}

export default CartPage;