// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API de Cupons', () => {

    let codigoCupom;
    let cupomTeste;
    let cupomid;
    let token;

    test.beforeAll(async ({ request }) => {
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
        // Create unique code (suffix random number)
        codigoCupom = `VIVA_LOS_CHICOS_${Math.floor(Math.random() * 1000000)}`;

        cupomTeste = {
            code: codigoCupom,
            description: "40% de desconto especial",
            discount_type: "percentage",
            discount_value: 40,
            min_order_amount: 10,
            max_uses: 100,
            // yesterday date
            starts_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            // future date 5 years
            expires_at: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
        };

        console.log(cupomTeste);
        const response = await request.post('/api/promotions', {
            data: cupomTeste,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.json();
        console.log(body);
        cupomid = body.promotion.id;

        expect(response.status()).toBe(201);
    });

    test('deve buscar o cupom criado', async ({ request }) => {
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
    });
});