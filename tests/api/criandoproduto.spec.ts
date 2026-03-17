// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API de Produtos', () => {

    let nomeProduto;
    let produtoTeste;
    let produtoid;
    let token;

    test.beforeAll(async ({ request }) => {
        // Realizando login como admin para obter o token
        const response = await request.post('/api/auth/login', {
            data: {
                email: 'admin@tacomex.com',
                password: 'admin123'
            }
        });
        const body = await response.json();
        token = body.token;
    });

    test.beforeEach(async ({ request }) => {
        // Criando um nome de produto único: Patata com Bacon Extra e Queijo Suíço
        nomeProduto = `Batata com Bacon e Queijo cheddar ${Math.floor(Math.random() * 1000000)}`;

        produtoTeste = {
            name: nomeProduto,
            description: "Uma batata especial com bacon crocante e queijo cheddar derretido",
            price: 25.00,
            category_id: 1, // Assumindo que a categoria 1 existe 
            image_url: "https://tacomex-8bit-shop.vercel.app/images/products/taco-1.png",
            stock_quantity: 100,
            is_active: true
        };

        console.log('Criando produto:', produtoTeste);
        const response = await request.post('/api/products', {
            data: produtoTeste,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.json();
        console.log('Resposta criação:', body);

        // Ajuste conforme a estrutura real da API
        produtoid = body.product.id;

        expect(response.status()).toBe(201);
    });

    test('deve buscar o produto criado na lista', async ({ request }) => {
        const response = await request.get('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        // Ajuste conforme a estrutura real da sua API
        const produtos = body.products || body;

        // Validando se o produtoid criado está na lista
        expect(produtos).toContainEqual(expect.objectContaining({ id: produtoid }));
        // Validando se o nome do produto criado está na lista
        expect(produtos).toContainEqual(expect.objectContaining({ name: nomeProduto }));
    });
});
