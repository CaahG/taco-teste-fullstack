import { test, expect } from '@playwright/test';

test('mudando status do pedido', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.locator('a[class="navbar__login-btn"]').click();
    // Realizando login com Admin
    await page.locator('input[type="email"]').fill('admin@tacomex.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    // Aguarda o login concluir verificando se o botão do usuário apareceu
    await expect(page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });

    // Abre o menu do usuário
    await page.locator('.navbar__user-btn').click();

    // Clica no 'Admin Panel' (aguardando o menu abrir)
    await page.locator('a:has-text("Admin Panel")').click();

    // Verifica se chegamos na página admin
    await expect(page).toHaveURL(/.*admin/);

    // Clica em 'Orders' no menu lateral
    await page.locator('a:has-text("Orders")').filter({ hasText: /^Orders$/ }).click();

    // Abre o primeiro card de pedido (aguarda carregar)
    await page.locator('.admin-orders__card-header').first().click();

    // Clica no botão 'Update Status' que deve aparecer dentro do card
    await page.locator('button:has-text("Update Status")').first().click();

    // Selecionando o novo status no dropdown
    await page.locator('.admin-orders__status-update select').first().selectOption('confirmed');

    // Confirmando a atualização clicando no botão 'Update' do modal/dropdown
    await page.locator('button:has-text("Update")').first().click();

    // Verificando se o status foi alterado para 'Confirmed' no badge
    await expect(page.locator('.order-status-badge__label').first()).toHaveText('Confirmed');
});
