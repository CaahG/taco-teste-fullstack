import { test, expect } from '@playwright/test';
import { AuthPage } from './pom/AuthPage';

test.describe('Logins Válidos', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
    });

    test('realizando login com admin', async ({ page }) => {
        const authPage = new AuthPage(page);
        await authPage.loginAdmin();

        // Explorando o menu e adicionando um produto
        await page.locator('a:has-text("Menu")').filter({ hasText: /^Menu$/ }).first().click();

        // Search menu
        await page.locator('input[placeholder="Search menu..."]').fill('Churro Combo');

        // Adicionando um produto ao carrinho
        const productCard = page.locator('.product-card').filter({ hasText: 'Churro Combo' });
        await productCard.locator('button[title="Add to Cart"]').click();
        await page.locator('button[aria-label="Increase quantity"]').click();

        // Verificando se a quantidade foi atualizada para '2' dentro do item do carrinho
        await expect(page.locator('.cart-sidebar__quantity-value')).toHaveText('2');

        // Abre carrinho e checkout
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

    test('realizando login com customer', async ({ page }) => {
        const authPage = new AuthPage(page);
        await authPage.loginCustomer();

        // Explorando produtos 
        await page.locator('a.navbar__link[href="/menu"]').click();

        // Selecionando a categoria 'Burritos'
        await page.locator('button:has-text("Burritos")').click();

        // Localizando o produto específico e clicando no botão 'Add to Cart' dentro dele
        const productCard = page.locator('.product-card').filter({ hasText: 'Level Up Chicken Burrito' });
        await productCard.locator('button[title="Add to Cart"]').click();

        // Abre carrinho e checkout
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

});
