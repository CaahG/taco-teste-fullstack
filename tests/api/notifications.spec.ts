import { test, expect } from '@playwright/test';
import { AuthAPI } from './pom/AuthAPI';
import { NotificationAPI } from './pom/NotificationAPI';

test.describe('API de Notificações', () => {

    test('deve receber uma notificação de SMS de boas-vindas após o cadastro de um novo usuário', async ({ request }) => {
        const authAPI = new AuthAPI(request);
        const notificationAPI = new NotificationAPI(request);

        // 1. Gerar dados aleatórios para o novo usuário para garantir um teste isolado
        const randomId = Math.floor(Math.random() * 1000000);
        const userName = `User${randomId}`;
        const userEmail = `user.${randomId}@tacomex.test`;
        const password = 'password123';

        console.log(`Registrando novo usuário: ${userName} (${userEmail})`);

        // 2. Registrar o novo usuário
        const registerResponse = await request.post('/api/auth/register', {
            data: {
                name: userName,
                email: userEmail,
                password: password
            }
        });

        // Validando se o cadastro foi bem sucedido (esperado 201 Created)
        expect(registerResponse.status(), 'O cadastro do usuário deve retornar 201').toBe(201);

        // 3. Realizar login para obter o token de autenticação
        // O login é necessário para acessar o endpoint de notificações do próprio usuário
        const token = await authAPI.login(userEmail, password);
        expect(token).toBeDefined();

        // 4. Buscar a lista de notificações do usuário
        const responseBody = await notificationAPI.getNotifications(token);

        // Log para depuração (opcional, ajuda a ver a estrutura real durante o desenvolvimento)
        console.log('Resposta de notificações:', JSON.stringify(responseBody, null, 2));

        // 5. Validar se a notificação de SMS existe e contém os dados esperados
        // Filtramos a lista de notificações para encontrar uma do canal 'sms'
        const smsNotification = responseBody.notifications.find((n: any) => n.channel === 'sms');

        // Asserções baseadas na inspeção fornecida pelo usuário
        expect(smsNotification, 'Deve existir uma notificação do tipo SMS').toBeDefined();
        expect(smsNotification.channel).toBe('sms');
        expect(smsNotification.body).toContain(`Welcome to TacoMex 8-BIT, ${userName}!`);
        expect(smsNotification.body).toContain('pixel-perfect menu');
        expect(smsNotification.body).toContain('FIRSTORDER');
        expect(smsNotification.from_address).toBe('+1-800-TACOMEX');

        // Verificando metadados de paginação (opcional mas bom para consistência)
        expect(responseBody.pagination).toBeDefined();
        expect(responseBody.pagination.total).toBeGreaterThanOrEqual(1);

        console.log('Teste finalizado com sucesso: Notificação SMS validada.');
    });
});
