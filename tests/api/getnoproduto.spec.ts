const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('./pom/AuthAPI');

test.describe('get no produto', () => {

    let token;

    test.beforeAll(async ({ request }) => {
        // Pega o token de autenticação
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();

    });

    test('deve buscar um produto específico pelo ID', async ({ request }) => {

        //  Colocando direto o ID do produto
        const produtoId = 26;

        // Mandando a requisição GET direto pra ele
        const response = await request.get(`/api/products/${produtoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        //  Só conferindo se deu certo (status 200 ou 204)
        expect(response.status()).toBe(200);
    });
});