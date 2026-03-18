import { APIRequestContext } from '@playwright/test';

export class AuthAPI {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Realiza login como admin e retorna o token de autenticação
     */
    async loginAdmin(): Promise<string> {
        const response = await this.request.post('/api/auth/login', {
            data: {
                email: 'admin@tacomex.com',
                password: 'admin123'
            }
        });

        if (!response.ok()) {
            throw new Error(`Falha ao realizar login: ${response.status()} ${response.statusText()}`);
        }

        const body = await response.json();
        return body.token;
    }

    /**
     * Realiza login genérico e retorna o token de autenticação
     */
    async login(email: string, password: string): Promise<string> {
        const response = await this.request.post('/api/auth/login', {
            data: {
                email: email,
                password: password
            }
        });

        if (!response.ok()) {
            throw new Error(`Falha ao realizar login: ${response.status()} ${response.statusText()}`);
        }

        const body = await response.json();
        return body.token;
    }
}
