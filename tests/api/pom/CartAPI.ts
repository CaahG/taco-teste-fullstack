import { APIRequestContext } from '@playwright/test';

export class CartAPI {
    readonly request: APIRequestContext;
    readonly token: string;

    constructor(request: APIRequestContext, token: string) {
        this.request = request;
        this.token = token;
    }

    /**
     * Headers comuns com o token de autenticação
     */
    private get headers() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    /**
     * Adiciona um item ao carrinho
     */
    async addItem(productId: number | string, quantity: number) {
        const response = await this.request.post('/api/cart/items', {
            data: {
                product_id: productId,
                quantity: quantity
            },
            headers: this.headers
        });
        return response;
    }

    /**
     * Atualiza a quantidade de um item no carrinho
     */
    async updateQuantity(productId: number | string, quantity: number) {
        const response = await this.request.patch(`/api/cart/items/${productId}`, {
            data: {
                quantity: quantity
            },
            headers: this.headers
        });
        return response;
    }

    /**
     * Remove um item específico do carrinho
     */
    async removeItem(productId: number | string) {
        const response = await this.request.delete(`/api/cart/items/${productId}`, {
            headers: this.headers
        });
        return response;
    }

    /**
     * Esvazia completamente o carrinho
     */
    async emptyCart() {
        const response = await this.request.delete('/api/cart', {
            headers: this.headers
        });
        return response;
    }
}
