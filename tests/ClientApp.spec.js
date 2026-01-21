import { test, expect } from '@playwright/test';

test.describe.serial('Client App UI Basic Tests', () => {

    test('001TC: Client App login', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client');
        const pageTitle = await page.title();
        console.log("Page Title is: " + pageTitle);

        // locator variables, for reuse.
        const email = page.locator('#userEmail');
        const password = page.locator('#userPassword');
        const login = page.locator('#login');
        const cardTitles = page.locator('.card-body b');

        // login
        await email.fill('testerone@email.com');
        await password.fill('testerOne1');
        await login.click();

        // explicitly handling page contents load sync for allTextContents()

        //M1: DISCOURAGED - could be flaky
        // wait until the network comes to idle state. i.e., all REST service calls are completed.
        // await page.waitForLoadState('networkidle'); // COULD BE FLAKY

        //M2:
        // waitFor() waits for single element; so using first()
        await cardTitles.first().waitFor(); // waits for specified element is loaded on the page.

        // now, allTextContents() will run only after the page contents are loaded.
        console.log(await cardTitles.allTextContents());
    });

    test('002TC: Client App E2E flow', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client');

        // locator variables, for reuse.
        const emaiID = 'testerone@email.com';
        const email = page.locator('#userEmail');
        const password = page.locator('#userPassword');
        const login = page.locator('#login');
        const products = page.locator('.card-body');
        const cardTitles = page.locator('.card-body b');

        // login
        await email.fill(emaiID);
        await password.fill('testerOne1');
        await login.click();

        // waitFor() waits for single element; so using first()
        await cardTitles.first().waitFor(); // waits for specified element is loaded on the page.
        // now, allTextContents() will run only after the page contents are loaded.
        // console.log("All available Products: " +await cardTitles.allTextContents()); 

        const requiredProduct = "ADIDAS ORIGINAL";
        const productsCount = await products.count(); // Returns the number of elements matching the locator.
        for (let i = 0; i < productsCount; i++) {
            const productName = await products.nth(i).locator('b').textContent(); // locator chaining
            if (productName == requiredProduct) {
                await products.nth(i).locator('text= Add To Cart').click(); // text based locator
                break;
            }
        }

        // My Cart
        await page.locator("button[routerlink='/dashboard/cart']").click();
        //wait for items to load
        await page.locator(".cart li").first().waitFor();

        const isPresentInCart = await page.locator("h3:has-text('" + requiredProduct + "')").isVisible();   // sudo class
        expect(isPresentInCart).toBeTruthy();

        //Checkout
        await page.locator(".subtotal button").click();

        // Handling auto suggestive dropdown
        // await page.locator("[placeholder='Select Country']").pressSequentially("ind");  // pressSequentially() // may fail when server is slow due to heavy traffic.
        await page.locator("[placeholder='Select Country']").pressSequentially("ind", { delay: 150 });  // enters i → (delay 150ms) → enters n → (delay 150ms) → enters d
        const dropdown = page.locator("section.ta-results");
        await dropdown.waitFor();
        const optionsCount = await dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; i++) {
            const option = (await dropdown.locator("span").nth(i).innerText()).trim();  // innerText() returns string; textContent() returns string | null (req extra null check)
            if (option === "India") {
                await dropdown.locator("button").nth(i).click();
                break;
            }
        }

        // assert email id
        // expect((await page.locator(".user__name label").innerText()).trim()).toEqual(emaiID);
        await expect(page.locator(".user__name label")).toHaveText(emaiID);   // toHaveText()
        // console.log("email id matched");

        // place order btn
        await page.locator(".action__submit").click();
        // assert Thankyou msg
        await expect(page.locator(".hero-primary")).toContainText("Thankyou");
        // console.log(await page.locator(".hero-primary").innerText());

        const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
        console.log("Order id: " + orderID);

        // My Orders
        await page.locator("button[routerlink='/dashboard/myorders']").click();
        await page.locator("tbody").waitFor();
        const orders = page.locator("tbody tr");
        for (let i = 0; i < await orders.count(); i++) {
            const currentOrderID = await orders.nth(i).locator("th").textContent();
            if (orderID.includes(currentOrderID)) {
                await orders.nth(i).locator("button").first().click();
                break;
            }
        }

        expect(orderID).toContain(await page.locator("div.col-text").textContent());
        console.log(await page.locator("div.col-text").innerText());
        // expect(orderID.includes(await page.locator("div.col-text").textContent())).toBeTruthy();
        console.log("TEST PASSED");
    });

    test('003TC: Client App E2E flow using Playwright special Locators', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client');

        // locator variables, for reuse.
        const emaiID = 'testerone@email.com';
        const products = page.locator('.card-body');
        const cardTitles = page.locator('.card-body b');

        // login
        await page.getByPlaceholder("email@example.com").fill(emaiID);
        await page.getByPlaceholder("enter your passsword").fill('testerOne1');
        await page.getByRole("button", { name: "loGin" }).click();

        // waitFor() waits for single element; so using first()
        await cardTitles.first().waitFor(); // waits for specified element is loaded on the page.

        // add to cart
        const requiredProduct = "ADIDAS ORIGINAL";
        await products.filter({ hasText: "ADIDAS" }).getByRole("button", { name: "Add to cart" }).click();  // regex check; Add to cart == Add to Cart == Add to CART

        // My Cart
        await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();

        //wait for items to load
        await page.locator(".cart li").first().waitFor();

        // check cart
        await expect(page.getByText(requiredProduct)).toBeVisible();

        // Checkout
        await page.getByRole("button", { name: "Checkout" }).click();

        // Handling auto suggestive dropdown
        await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 });
        await page.getByRole("button", { name: "India" }).nth(1).click();

        // place order btn
        await page.getByText("Place Order").click();

        //  Thankyou for the order. 
        // assert Thankyou msg
        await expect(page.getByText("Thankyou")).toBeVisible();
        console.log("TEST PASSED");
    });
    
});