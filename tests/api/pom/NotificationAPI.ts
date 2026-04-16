import { APIRequestContext } from '@playwright/test';

export class NotificationAPI {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Busca a lista de notificações do usuário autenticado
     * @param token Token de autenticação Bearer
     * @returns Objeto contendo a lista de notificações e paginação
     */
    async getNotifications(token: string) {
        const response = await this.request.get('/api/notifications', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Falha ao buscar notificações: ${response.status()} ${response.statusText()}`);
        }

        return await response.json();
    }
}
