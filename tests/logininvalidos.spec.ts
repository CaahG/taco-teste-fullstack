import { test, expect } from '@playwright/test';

test.describe('Logins Inválidos', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
    });

    test('login inválido com admin - Bilbo Bolseiro', async ({ page }) => {
        await page.locator('a[class="navbar__login-btn"]').click();

        // Preenchendo dados de login inválidos para Admin (Hobbit style)
        await page.locator('input[type="email"]').fill('bilbo.bolseiro@hobbiton.com');
        await page.locator('input[type="password"]').fill('admin123');

        // Capturando a resposta do login para validar o status 400
        const loginResponsePromise = page.waitForResponse(response =>
            response.url().includes('/auth/login') && response.status() === 400
        );

        await page.locator('button[type="submit"]').click();

        const response = await loginResponsePromise;
        expect(response.status()).toBe(400);

        // Opcional: Verificar se continua na página de login ou exibe erro
        await expect(page).toHaveURL(/.*login/);
    });

    test('login inválido com customer - Thorin Escudodecarvalho', async ({ page }) => {
        await page.locator('a[class="navbar__login-btn"]').click();

        // Preenchendo dados de login inválidos para Customer (Hobbit style)
        await page.locator('input[type="email"]').fill('thorin.escudodecarvalho@erebor.com');
        await page.locator('input[type="password"]').fill('pass123');

        // Capturando a resposta do login para validar o status 400
        const loginResponsePromise = page.waitForResponse(response =>
            response.url().includes('/auth/login') && response.status() === 400
        );

        await page.locator('button[type="submit"]').click();

        const response = await loginResponsePromise;
        expect(response.status()).toBe(400);

        // Opcional: Verificar se continua na página de login ou exibe erro
        await expect(page).toHaveURL(/.*login/);
    });

});
