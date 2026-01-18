class DashboardPage{

    constructor(page){
        this.page = page;
        // Locators
        this.products = page.locator('.card-body');
        this.productTitles = page.locator('.card-body b');
        this.cart = page.locator("button[routerlink='/dashboard/cart']");
    }

    async waitForProductsToLoad(){
        await this.productTitles.first().waitFor();
    }

    async addProductToCart(requiredProduct) {
        const productsCount = await this.products.count();
        for (let i = 0; i < productsCount; i++) {
            const productName = await this.products.nth(i).locator('b').textContent(); // locator chaining
            if (productName.trim() == requiredProduct) {
                await this.products.nth(i).locator('text= Add To Cart').click(); // text based locator
                break;
            }
        }
    }

    async navigateToCart(){
        await this.cart.click();
    }
}

export default DashboardPage;