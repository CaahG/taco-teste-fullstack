import { test, expect } from '@playwright/test';

test('realizando login com admin', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.locator('a[class="navbar__login-btn"]').click();
    //realizando login com Admin
    await page.locator('input[type="email"]').fill('admin@tacomex.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    // explorando o menu e adicionando um produto
    await page.locator('a:has-text("Menu")').filter({ hasText: /^Menu$/ }).first().click();
    // search menu
    await page.locator('input[placeholder="Search menu..."]').fill('Churro Combo');

    // Adicionando um produto ao carrinho
    await page.locator('button[title="Add to Cart"]').click();

    await page.locator('button[aria-label="Increase quantity"]').click();

    // Verificando se a quantidade foi atualizada para '2' dentro do item do carrinho
    await expect(page.locator('.cart-sidebar__quantity-value')).toHaveText('2');

    // Abre carrinho
    await page.locator('button:has-text("Checkout")').click();

    // Preenche dados de checkout
    await page.locator('input[placeholder="123 Taco Street"]').fill(
        'Rua Dom Pedro II número 08, (portão fica ao lado do Procon ), apto 105'
    );
    await page.locator('input[placeholder="Austin"]').fill('Canela');
    await page.locator('input[placeholder="TX"]').fill('RS');
    await page.locator('input[placeholder="78701"]').fill('95680222');
    await page.locator('input[placeholder="(555) 123-4567"]').fill('11981547689');

    await page.locator('button:has-text("Place Order")').click();
    const successMessage = page.locator('.order-detail__success-content');

    await expect(successMessage).toBeVisible({ timeout: 10000 });
    await expect(successMessage).toContainText('Order Placed Successfully!');

});

