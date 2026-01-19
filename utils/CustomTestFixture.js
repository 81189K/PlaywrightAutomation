import { test } from "@playwright/test";

export const customTest = test.extend(
    {
        testDataForOrder: {
            emailID: "testerone@email.com",
            password: "testerOne1",
            requiredProduct: "ADIDAS ORIGINAL"
        }
    }
)