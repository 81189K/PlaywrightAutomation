import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import MyOrdersPage from './MyOrdersPage';

class POManager{

    constructor(page){
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.ordersPage = new OrdersPage(page);
        this.orderConfirmationPage = new OrderConfirmationPage(page);
        this.myOrdersPage = new MyOrdersPage(page);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.dashboardPage;
    }

    getCartPage(){
        return this.cartPage;
    }

    getOrdersPage(){
        return this.ordersPage;
    }

    getOrderConfirmationPage(){
        return this.orderConfirmationPage;
    }

    getMyOrdersPage(){
        return this.myOrdersPage;
    }
}

export default POManager;