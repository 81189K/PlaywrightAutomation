class LoginPage {

    constructor(page){
        this.page = page;
        // Locators
        this.email = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.signInBtn = page.locator('#login');
    }

    async goToLandingURL(){
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        await this.page.goto('https://rahulshettyacademy.com/client');
    }

    async validLogin(email, password){
        await this.email.fill(email);
        await this.password.fill(password);
        await this.signInBtn.click();
    }
}

export default LoginPage;
