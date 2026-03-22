const { test, expect } = require('@playwright/test');


test.describe('API de Cadastro de usuarios', () => {
    test('Criação de usuario com sucesso', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: `Usuario Teste ${Math.floor(Math.random() * 1000000)}`,
                email: `email.${Math.floor(Math.random() * 1000000)}@teste.com`,
                password: 'password123'
            }
        });
        expect(response.status()).toBe(201);
    })

    test('Criação de usuario sem nome com insucesso', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: '',
                email: `email.${Math.floor(Math.random() * 1000000)}@teste.com`,
                password: 'password123'
            }
        });
        expect(response.status()).toBe(400);
    })

    test('Criação de usuario sem email com insucesso', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: `Usuario Teste ${Math.floor(Math.random() * 1000000)}`,
                email: '',
                password: 'password123'
            }
        });
        expect(response.status()).toBe(400);
    })

    test('Criação de usuario sem senha com insucesso', async ({ request }) => {
        const response = await request.post('/api/auth/register', {
            data: {
                name: `Usuario Teste ${Math.floor(Math.random() * 1000000)}`,
                email: `email.${Math.floor(Math.random() * 1000000)}@teste.com`,
                password: ''
            }
        });
        expect(response.status()).toBe(400);
    })
});