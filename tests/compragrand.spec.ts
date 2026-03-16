import { test, expect } from '@playwright/test';

test('fazendo uma compra grande', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.locator('a[class="navbar__login-btn"]').click();
  // Realizando login com Admin
  await page.locator('input[type="email"]').fill('customer@tacomex.com');
  await page.locator('input[type="password"]').fill('pass123');
  await page.locator('button[type="submit"]').click();

  // Aguarda o login concluir verificando se o botão do usuário apareceu
  await expect(page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });

  // explorando produtos 
  await page.locator('a.navbar__link[href="/menu"]').click();

  // Função auxiliar interna para buscar e adicionar produtos (seguindo seu padrão de locator)
  const addProduct = async (name: string) => {
    await page.locator('input[placeholder="Search menu..."]').fill(name);
    await page.locator('.product-card').filter({ hasText: name }).locator('button[title="Add to Cart"]').click();

    // FECHAR O CARRINHO: O overlay aparece após adicionar e bloqueia a tela
    await page.locator('.cart-sidebar__overlay').click();

    await page.locator('button.menu__search-clear').click();
  };

  // Adicionando vários produtos usando a busca
  await addProduct('Elote Coins');
  await addProduct('Cheese Quest Quesadilla');
  await addProduct('Fish Frenzy Taco');
  await addProduct('Flan Finale');
  await addProduct('Pixel Chips & Guacamole');
  await addProduct('Chicken Champion Quesadilla');

  // Abrir o carrinho explicitamente (já que a função addProduct fecha ele após cada item)
  await page.locator('button.navbar__cart-btn').click();

  // Finalizando a compra (Checkout)
  await page.locator('button:has-text("Checkout")').click();

  // Preenchendo dados de entrega
  await page.locator('input[placeholder="123 Taco Street"]').fill('Avenida Paulista, 1000');
  await page.locator('input[placeholder="Austin"]').fill('São Paulo');
  await page.locator('input[placeholder="TX"]').fill('SP');
  await page.locator('input[placeholder="78701"]').fill('01311-100');
  await page.locator('input[placeholder="(555) 123-4567"]').fill('(11) 98765-4321');

  // Clicando em Finalizar Pedido
  await page.locator('button:has-text("Place Order")').click();

  // Verificando se o pedido foi concluído com sucesso
  const successMessage = page.locator('.order-detail__success-content');
  await expect(successMessage).toBeVisible({ timeout: 10000 });
  await expect(successMessage).toContainText('Order Placed Successfully!');
});