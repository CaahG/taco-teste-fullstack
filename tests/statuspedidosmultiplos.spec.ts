import { test, expect } from '@playwright/test';

test.describe('Mudando status dos pedidos já feitos', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Realizando login com Admin
        await page.locator('a[class="navbar__login-btn"]').click();
        await page.locator('input[type="email"]').fill('admin@tacomex.com');
        await page.locator('input[type="password"]').fill('admin123');
        await page.locator('button[type="submit"]').click();

        // Espera login e clica no botão do usuário para abrir o menu dropdown
        const userBtn = page.locator('.navbar__user-btn');
        await expect(userBtn).toBeVisible({ timeout: 10000 });
        await userBtn.click();

        // Acessa o Painel Admin via dropdown
        await page.locator('a[href="/admin"]').click();

        // Navega para a aba de Orders no painel lateral
        await page.getByRole('link', { name: 'Orders', exact: true }).click();
    });

    test('mudando status do pedido #0048 para PREPARING - Bilbo Bolseiro', async ({ page }) => {
        const orderCard = page.locator('.admin-orders__card').filter({ hasText: '#0048' });
        await expect(orderCard).toBeVisible({ timeout: 10000 });
        await orderCard.getByRole('button', { name: 'Update Status' }).click();

        // Seleciona o status 'preparing'
        await page.locator('.admin-orders__status-update select').selectOption('preparing');
        await page.locator('.admin-orders__status-update').getByRole('button', { name: 'Update' }).click();

        // Recarrega a página para garantir que a alteração foi persistida
        await page.reload();

        // Verifica se o status foi alterado com sucesso no badge após o reload
        const updatedOrderCard = page.locator('.admin-orders__card').filter({ hasText: '#0048' });
        await expect(updatedOrderCard.locator('.order-status-badge__label')).toHaveText('Preparing');
    });

    test('mudando status do pedido #0047 para READY - Thorin Escudodecarvalho', async ({ page }) => {
        const orderCard = page.locator('.admin-orders__card').filter({ hasText: '#0047' });
        await expect(orderCard).toBeVisible({ timeout: 10000 });
        await orderCard.getByRole('button', { name: 'Update Status' }).click();

        // Seleciona o status 'ready'
        await page.locator('.admin-orders__status-update select').selectOption('ready');
        await page.locator('.admin-orders__status-update').getByRole('button', { name: 'Update' }).click();

        // Recarrega a página para garantir que a alteração foi persistida
        await page.reload();

        // Verifica se o status foi alterado com sucesso no badge após o reload
        const updatedOrderCard = page.locator('.admin-orders__card').filter({ hasText: '#0047' });
        await expect(updatedOrderCard.locator('.order-status-badge__label')).toHaveText('Ready');
    });

    test('mudando status do pedido #0046 para OUT FOR DELIVERY - Frodo Bolseiro', async ({ page }) => {
        const orderCard = page.locator('.admin-orders__card').filter({ hasText: '#0046' });
        await expect(orderCard).toBeVisible({ timeout: 10000 });
        await orderCard.getByRole('button', { name: 'Update Status' }).click();

        // Seleciona o status 'out_for_delivery'
        await page.locator('.admin-orders__status-update select').selectOption('CONFIRMED');
        await page.locator('.admin-orders__status-update').getByRole('button', { name: 'Update' }).click();

        // Recarrega a página para garantir que a alteração foi persistida
        await page.reload();

        // Verifica se o status foi alterado com sucesso no badge após o reload
        const updatedOrderCard = page.locator('.admin-orders__card').filter({ hasText: '#0046' });
        await expect(updatedOrderCard.locator('.order-status-badge__label')).toHaveText('Confirmed');
    });

    test('mudando status do pedido #0045 para DELIVERED - Gandalf', async ({ page }) => {
        const orderCard = page.locator('.admin-orders__card').filter({ hasText: '#0045' });
        await expect(orderCard).toBeVisible({ timeout: 10000 });
        await orderCard.getByRole('button', { name: 'Update Status' }).click();

        // Seleciona o status 'delivered'
        await page.locator('.admin-orders__status-update select').selectOption('delivered');
        await page.locator('.admin-orders__status-update').getByRole('button', { name: 'Update' }).click();

        // Recarrega a página para garantir que a alteração foi persistida
        await page.reload();

        // Verifica se o status foi alterado com sucesso no badge após o reload
        const updatedOrderCard = page.locator('.admin-orders__card').filter({ hasText: '#0045' });
        await expect(updatedOrderCard.locator('.order-status-badge__label')).toHaveText('Delivered');
    });

});
