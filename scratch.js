const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    page.on('request', request => {
        if (request.url().includes('/api/')) console.log('>>', request.method(), request.url(), request.postData());
    });
    
    await page.goto('http://localhost:5173/');
    
    // Register
    await page.locator('.navbar__btn:has-text("Login")').click();
    await page.locator('text="Register"').click();
    const id = Math.floor(Math.random()*1000);
    await page.locator('input[placeholder="Full Name"]').fill('Test User');
    await page.locator('input[placeholder="Email address"]').fill(`test${id}@tacomex.com`);
    await page.locator('input[placeholder="Password"]').fill('password123');
    await page.locator('button:has-text("Create Account")').click();
    await page.waitForTimeout(1000);
    
    // add item
    await page.goto('http://localhost:5173/menu');
    await page.locator('.product-card button[title="Add to Cart"]').first().click();
    
    // checkout
    await page.locator('button.navbar__cart-btn').click();
    await page.locator('button:has-text("Checkout")').click();
    await page.locator('input[placeholder="123 Taco Street"]').fill('Rua 1');
    await page.locator('input[placeholder="Austin"]').fill('City');
    await page.locator('input[placeholder="TX"]').fill('TX');
    await page.locator('input[placeholder="78701"]').fill('12345');
    await page.locator('input[placeholder="(555) 123-4567"]').fill('123456');
    await page.locator('button:has-text("Place Order")').click();
    await page.waitForTimeout(2000);
    
    await browser.close();
})();
