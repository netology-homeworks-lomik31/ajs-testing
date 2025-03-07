import puppetteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Credit Card Validator form", () => {
    let browser = null;
    let page = null;
    let server = null;
    const baseUrl = "http://localhost:9000";

    beforeAll(async () => {
        server = fork(`${__dirname}/e2e.server.js`);
        await new Promise((resolve, reject) => {
            server.on("error", reject);
            server.on("message", (message) => {
                if (message === "ok") {
                    resolve();
                }
            });
        });

        browser = await puppetteer.launch({
            // headless: false, // show gui
            // slowMo: 250,
            // devtools: true, // show devTools
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
        server.kill();
    });

    test("should add do something", async () => {
        await page.goto(baseUrl);
        let container = await page.$(".container");
        let form = await container.$(".payment-form");
        let icons = await container.$(".payment-icons");
        let cardNumber = await form.$("#card-number");
        let submit = await form.$("button[type=submit]");
        let errorMessage = await container.$(".error-message");
        expect(container).not.toBeNull();
        expect(form).not.toBeNull();
        expect(icons).not.toBeNull();
        expect(cardNumber).not.toBeNull();
        expect(submit).not.toBeNull();
        expect(errorMessage).not.toBeNull();

        let paymentIcons = await icons.$$(".payment-icon");
        expect(paymentIcons.length).toBe(5);
        for (let icon of paymentIcons) {
            expect(icon).not.toBeNull();
        }

        await cardNumber.type("1234");
        await submit.click();
        expect(await errorMessage.evaluate((node) => node.style.display)).toBe(
            "block",
        );
        await cardNumber.evaluate((node) => (node.value = ""));
        await cardNumber.type("4716769105738725");
        await submit.click();
        expect(await errorMessage.evaluate((node) => node.style.display)).toBe(
            "none",
        );
        expect(
            await icons.$eval("img", (node) => {
                console.log(node.src);
                return node.src.endsWith("visa.svg");
            }),
        ).toBe(true);

        let imgElements = await icons.$$("img");
        for (let img of imgElements) {
            let src = await img.evaluate((node) => node.src);
            let expected = "";
            if (!src.endsWith("visa.svg")) expected = "-outline.svg";
            else expected = ".svg";
            expect(src.endsWith(expected)).toBe(true);
        }
    });
});
