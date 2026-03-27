const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('./pom/AuthAPI');

test.describe('API de Exclusão de Usuário', () => {
    let token;

    test.beforeAll(async ({ request }) => {
        // Realizando login como admin usando o POM (AuthAPI) para obter o token
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test('deve deletar um usuário específico pelo nome - Gintoki Machado', async ({ request }) => {
        // 1. Buscar a lista de usuários para encontrar o ID do "Gintoki Machado"
        const listResponse = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(listResponse.status()).toBe(200);
        const listBody = await listResponse.json();

        // Procurando o usuário pelo nome na lista
        const users = listBody.users || listBody;
        const targetUser = users.find(u => u.name === 'Gintoki Machado');

        if (!targetUser) {
            throw new Error('Usuário "Gintoki Machado" não encontrado na lista.');
        }

        const userId = targetUser.id;
        console.log(`ID do usuário encontrado: ${userId}`);

        // 2. Mandar a requisição DELETE para o usuário
        const deleteResponse = await request.delete(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Verificando se a deleção foi bem-sucedida (status 200 ou 204)
        expect([200, 204]).toContain(deleteResponse.status());
        console.log(`Usuário ${userId} (Gintoki Machado) deletado com sucesso.`);

        // 3. Validar que o usuário não está mais na lista
        const verifyResponse = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const verifyBody = await verifyResponse.json();
        const verifiedUsers = verifyBody.users || verifyBody;
        expect(verifiedUsers.find(u => u.id === userId)).toBeUndefined();
    });
});
