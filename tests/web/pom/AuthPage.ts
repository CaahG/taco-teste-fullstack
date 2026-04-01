import { Page, expect } from '@playwright/test';

export class AuthPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Realiza login como admin no sistema web
     */
    async loginAdmin() {
        await this.page.locator('a[class="navbar__login-btn"]').click();
        await this.page.locator('input[type="email"]').fill('admin@tacomex.com');
        await this.page.locator('input[type="password"]').fill('admin123');
        await this.page.locator('button[type="submit"]').click();

        // Aguarda a conclusão do login garantindo que o botão de usuário apareça
        await expect(this.page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });
    }

    /**
     * Realiza login como customer no sistema web
     */
    async loginCustomer() {
        await this.page.locator('a[class="navbar__login-btn"]').click();
        await this.page.locator('input[type="email"]').fill('customer@tacomex.com');
        await this.page.locator('input[type="password"]').fill('pass123');
        await this.page.locator('button[type="submit"]').click();

        // Aguarda a conclusão do login garantindo que o botão de usuário apareça
        await expect(this.page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });
    }

    /**
     * Realiza login genérico (podendo criar um novo usuário e então logar) no web
     */
    async login(email: string, password: string) {
        await this.page.locator('a[class="navbar__login-btn"]').click();
        await this.page.locator('input[type="email"]').fill(email);
        await this.page.locator('input[type="password"]').fill(password);
        await this.page.locator('button[type="submit"]').click();

        // Aguarda a conclusão do login garantindo que o botão de usuário apareça
        await expect(this.page.locator('.navbar__user-btn')).toBeVisible({ timeout: 10000 });
    }
}
