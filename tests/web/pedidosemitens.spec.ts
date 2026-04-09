import { test, expect } from '@playwright/test';
import { AuthPage } from './pom/AuthPage';

test.describe('Realização de Compras - Cenários Vazios', () => {
  test('não deve permitir finalizar pedido com carrinho vazio', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const authPage = new AuthPage(page);
    await authPage.loginCustomer();

    // Clica no botão do carrinho para abri-lo
    await page.locator('button.navbar__cart-btn').click();

    // Procura pelo botão de Checkout
    const checkoutButton = page.locator('button:has-text("Checkout")');

    // Valida o comportamento esperado: 
    // Na maioria dos e-commerces o botão Checkout ou fica desabilitado ou não aparece,
    // e o carrinho deve mostrar alguma mensagem informando que está vazio.
    if (await checkoutButton.isVisible()) {
        // Se o botão aparece, é obrigatório que ele esteja desabilitado
        await expect(checkoutButton).toBeDisabled();
    } else {
        // Se o botão não aparece, garante que existe uma mensagem indicando carrinho vazio
        // A classe cart-sidebar é usada no projeto (vi no teste 'compragrand')
        await expect(page.locator('.cart-sidebar')).toContainText(/empty|nenhum item|vazio/i);
    }
  });
});
