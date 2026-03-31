import { test, expect } from '@playwright/test';
import { AuthAPI } from './pom/AuthAPI';
import { CartAPI } from './pom/CartAPI';

test.describe.serial('API de Carrinho de Compras', () => {

    let token: string;
    let cartAPI: CartAPI;
    let itemIdAdicionado: any;

    // Produto genérico para teste
    const produtoIdParaTeste = 19;

    test.beforeAll(async ({ request }) => {
        // Obter o token de autenticação (usando admin ou cliente padrão)
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test.beforeEach(async ({ request }) => {
        // Instancia a classe do CartAPI antes de cada teste com a request limpa e o token de auth
        cartAPI = new CartAPI(request, token);
    });

    test('deve adicionar um item ao carrinho', async () => {
        const response = await cartAPI.addItem(produtoIdParaTeste, 2); // adiciona 2 unidades do produto

        // Assumindo que o retorno seja 200 OK ou 201 Created
        expect([200, 201]).toContain(response.status());

        const body = await response.json();
        console.log('Resposta ao adicionar item:', body);
    });

    test('deve atualizar a quantidade do item no carrinho', async () => {
        // Usamos o product_id para atualizar a quantidade (ex: 5)
        const response = await cartAPI.updateQuantity(produtoIdParaTeste, 6);

        const body = await response.json();
        console.log('Resposta ao atualizar quantidade:', body);

        // Verificando status 200 OK
        expect(response.status()).toBe(200);
    });

    test('deve remover o item do carrinho', async () => {
        const response = await cartAPI.removeItem(produtoIdParaTeste);

        // Algumas APIs retornam 204 (No Content) para delete com sucesso, outras 200 (OK)
        expect([200, 204]).toContain(response.status());
    });

    test('deve esvaziar o carrinho', async () => {
        // Garantindo apenas que esvazia tudo
        const response = await cartAPI.emptyCart();

        // 200 OK ou 204 No Content
        expect([200, 204]).toContain(response.status());
    });
});
