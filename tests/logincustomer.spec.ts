import { test, expect } from '@playwright/test';

test('realizando login com customer', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.locator('a[class="navbar__login-btn"]').click();
    //realizando login com Admin
    await page.locator('input[type="email"]').fill('customer@tacomex.com');
    await page.locator('input[type="password"]').fill('pass123');
    await page.locator('button[type="submit"]').click();

    // explorando produtos 
    await page.locator('a.navbar__link[href="/menu"]').click();

    // Selecionando a categoria 'Burritos'
    await page.locator('button:has-text("Burritos")').click();

    // Localizando o produto específico e clicando no botão 'Add to Cart' dentro dele
    const productCard = page.locator('.product-card').filter({ hasText: 'Level Up Chicken Burrito' });
    await productCard.locator('button[title="Add to Cart"]').click();

    // Abre carrinho
    await page.locator('button:has-text("Checkout")').click();

    // Preenche dados de checkout
    await page.locator('input[placeholder="123 Taco Street"]').fill('calle Pajaritos 08, puerta 05');
    await page.locator('input[placeholder="Austin"]').fill('sevilla');
    await page.locator('input[placeholder="TX"]').fill('sv');
    await page.locator('input[placeholder="78701"]').fill('40014');
    await page.locator('input[placeholder="(555) 123-4567"]').fill('34 661 992902');

    await page.locator('button:has-text("Place Order")').click();
    const successMessage = page.locator('.order-detail__success-content');

    await expect(successMessage).toBeVisible({ timeout: 10000 });
    await expect(successMessage).toContainText('Order Placed Successfully!');
});
