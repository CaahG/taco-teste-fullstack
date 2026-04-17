import { APIRequestContext } from '@playwright/test';

export class NotificationAPI {
    readonly request: APIRequestContext;
    readonly token: string;

    constructor(request: APIRequestContext, token: string) {
        this.request = request;
        this.token = token;
    }

    /**
     * Busca a lista de notificações do usuário autenticado
     * @returns Objeto contendo a lista de notificações e paginação
     */
    async getNotifications() {
        const response = await this.request.get('/api/notifications', {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Falha ao buscar notificações: ${response.status()} ${response.statusText()}`);
        }

        return await response.json();
    }
}
