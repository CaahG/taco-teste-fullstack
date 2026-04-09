import { test, expect } from '@playwright/test';
import { AuthAPI } from './pom/AuthAPI';

test.describe('API de Atualização de Usuário', () => {
    let token: string;

    test.beforeAll(async ({ request }) => {
        // Realizando login como admin para obter o token com permissões
        const authAPI = new AuthAPI(request);
        token = await authAPI.loginAdmin();
    });

    test('deve atualizar o nome de um usuário específico - Gintoki Machado', async ({ request }) => {
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
        const targetUser = users.find((u: any) => u.name.includes('Gintoki Machado') || u.email === 'gintokimachado04@gmail.com');

        if (!targetUser) {
            throw new Error('Usuário "Gintoki Machado" não encontrado na lista.');
        }

        const userId = targetUser.id;
        const oldName = targetUser.name;
        const newName = 'Gintoki Machado Atualizado';

        console.log(`ID do usuário encontrado: ${userId}. Alterando nome de "${oldName}" para "${newName}"`);

        // 2. Mandar a requisição PATCH para atualizar o nome
        const updateResponse = await request.patch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: newName
            }
        });

        // Verificando se a atualização foi bem-sucedida
        expect(updateResponse.status()).toBe(200);
        const updateBody = await updateResponse.json();
        expect(updateBody.user.name).toBe(newName);

        // 3. Validar que a alteração persiste ao buscar a lista novamente
        const verifyResponse = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const verifyBody = await verifyResponse.json();
        const verifiedUsers = verifyBody.users || verifyBody;
        const updatedUser = verifiedUsers.find((u: any) => u.id === userId);
        
        expect(updatedUser.name).toBe(newName);
        console.log(`Sucesso: Usuário ${userId} agora se chama "${updatedUser.name}".`);

        // 4. Resetar o nome para o original (Cleanup)
        await request.patch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                name: oldName
            }
        });
    });
});
