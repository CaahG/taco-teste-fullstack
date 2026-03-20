// @ts-check
const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('./pom/AuthAPI');

test.describe('API de cupom 90 de desconto', () => {

    let token;
    let codigoCupom;
    let cupomTeste;
    let cupomid;

    test.beforeAll(async ({ request }) => {
        // Pega o token de autenticação
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test.beforeEach(async ({ request }) => {
        // Create unique code (suffix random number)
        codigoCupom = `VIVA_LOS_CHICOS_PREMIUM_${Math.floor(Math.random() * 1000000)}`;

        cupomTeste = {
            code: codigoCupom,
            description: "90% de desconto especial",
            discount_type: "percentage",
            discount_value: 90,
            min_order_amount: 10,
            max_uses: 100,
            // yesterday date
            starts_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            // future date 5 years
            expires_at: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
        };

        console.log('Criando cupom:', cupomTeste);
        const response = await request.post('/api/promotions', {
            data: cupomTeste,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.json();
        console.log('Resposta criação:', body);
        cupomid = body.promotion.id;

        expect(response.status()).toBe(201);
    });

    test('deve buscar o cupom de 90% criado', async ({ request }) => {
        const response = await request.get(`/api/promotions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        // validar se o cupomid criado esta na lista
        expect(body.promotions).toContainEqual(expect.objectContaining({ id: cupomid }));
        // validar se o codigo do cupom criado esta na lista
        expect(body.promotions).toContainEqual(expect.objectContaining({ code: codigoCupom }));
        // validar o valor do desconto
        expect(body.promotions).toContainEqual(expect.objectContaining({
            id: cupomid,
            discount_value: 90
        }));
    });
});
