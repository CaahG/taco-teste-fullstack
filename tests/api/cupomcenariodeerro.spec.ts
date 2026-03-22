// @ts-check
const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('./pom/AuthAPI');

test.describe('API de Cupons - Cenários de Erro (Dados Inválidos)', () => {

    let token;

    test.beforeAll(async ({ request }) => {
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test('não deve criar cupom sem o campo obrigatório "code"', async ({ request }) => {
        const cupomSemCode = {
            description: "Tentativa sem código",
            discount_type: "percentage",
            discount_value: 10,
            min_order_amount: 10,
            max_uses: 100,
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 86400000).toISOString()
        };

        const response = await request.post('/api/promotions', {
            data: cupomSemCode,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Espera-se erro 400 por falta de atributo obrigatório
        expect(response.status()).toBe(400);
        const body = await response.json();
        console.log('Erro campo obrigatório:', body);
    });

    test('não deve criar cupom com valor de desconto negativo', async ({ request }) => {
        const cupomNegativo = {
            code: `INVALID_NEG_${Math.floor(Math.random() * 1000)}`,
            description: "Desconto negativo",
            discount_type: "percentage",
            discount_value: -50,
            min_order_amount: 10,
            max_uses: 100,
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 86400000).toISOString()
        };

        const response = await request.post('/api/promotions', {
            data: cupomNegativo,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(400);
    });

    test('não deve criar cupom com tipo de desconto inválido', async ({ request }) => {
        const cupomTipoInvalido = {
            code: `INVALID_TYPE_${Math.floor(Math.random() * 1000)}`,
            description: "Tipo de desconto inexistente",
            discount_type: "invalid_type",
            discount_value: 10,
            min_order_amount: 10,
            max_uses: 100,
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 86400000).toISOString()
        };

        const response = await request.post('/api/promotions', {
            data: cupomTipoInvalido,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(400);
    });

    test('não deve criar cupom com data de expiração anterior à data de início', async ({ request }) => {
        const cupomDataInvalida = {
            code: `INVALID_DATE_${Math.floor(Math.random() * 1000)}`,
            description: "Data de expiração inválida",
            discount_type: "percentage",
            discount_value: 10,
            min_order_amount: 10,
            max_uses: 100,
            starts_at: new Date(Date.now() + 86400000).toISOString(), // amanhã
            expires_at: new Date().toISOString() // hoje (anterior ao início)
        };

        const response = await request.post('/api/promotions', {
            data: cupomDataInvalida,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(400);
    });
});
