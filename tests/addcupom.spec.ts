import { test, expect } from '@playwright/test';

test('Adicionando cupom em compras', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.locator('a[class="navbar__login-btn"]').click();
    // Realizando login com Admin
    await page.locator('input[type="email"]').fill('lucas.dpmachado@gmail.com');
    await page.locator('input[type="password"]').fill('150515@Arua');
    await page.locator('button[type="submit"]').click();

    // Aguarda o login concluir verificando se o botão do usuário apareceu
    await expect(page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });

    // explorando produtos 
    await page.locator('a.navbar__link[href="/menu"]').click();

    const addProduct = async (name: string) => {
        await page.locator('input[placeholder="Search menu..."]').fill(name);
        await page.locator('.product-card').filter({ hasText: name }).locator('button[title="Add to Cart"]').click();
        await page.locator('.cart-sidebar__overlay').click();
        await page.locator('button.menu__search-clear').click();
    };

    // Adicionando produtos
    await addProduct('Agua Fresca Refresh');
    await addProduct('Boss Battle Carnitas Taco');
    await addProduct('Cheese Quest Quesadilla');

    // Abrir o carrinho para aplicar o cupom
    await page.locator('button.navbar__cart-btn').click();

    // Adicionando cupom
    const promoCode = 'vivaloschico30';
    await page.locator('input[placeholder="Promo code"]').fill(promoCode);
    await page.locator('button:has-text("Apply")').click();

    // VERIFICAÇÃO: Garante que o cupom foi realmente aplicado antes de prosseguir
    const promoAppliedMessage = page.locator('.cart-sidebar__promo-applied');
    await expect(promoAppliedMessage).toBeVisible();

    // Abre checkout (que está dentro do carrinho)
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