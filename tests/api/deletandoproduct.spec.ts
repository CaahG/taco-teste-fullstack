const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('./pom/AuthAPI');

test.describe('API de Produtos - Delete', () => {

    let token;

    test.beforeAll(async ({ request }) => {
        // Pega o token de autenticação
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test('deve deletar um produto específico pelo ID', async ({ request }) => {

        //  Colocando direto o ID do produto
        const produtoId = 26;

        // Mandando a requisição DELETE direto pra ele
        const response = await request.delete(`/api/products/${produtoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        //  Só conferindo se deu certo (status 200 ou 204)
        expect(response.status()).toBe(200);
    });
});
