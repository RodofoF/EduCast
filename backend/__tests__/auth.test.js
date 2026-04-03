const request = require('supertest');
const app = require('../app'); // Importa o servidor para os testes
const dotenv = require('dotenv');
const sequelize = require('../src/config/db').sequelize;
const setupAssociations = require('../src/models/associations.model');
const defaultGroupsSeed = require('../src/config/seeds/default.groups.seed');
const createDefaultAdminUser = require('../src/config/seeds/createAdmin.seed');
dotenv.config();

let adminToken;

beforeAll(async () => {
    setupAssociations();
    await sequelize.authenticate();
    await defaultGroupsSeed();
    await createDefaultAdminUser();

    // Fazer login para obter o token de autenticação do admin
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: process.env.ADMIN_DEFAULT_EMAIL,
            password: process.env.ADMIN_DEFAULT_PASSWORD
        });

    adminToken = loginRes.body.token;
});

afterAll(async () => {
    // Fechar o servidor após os testes para evitar conexões pendentes
    await sequelize.close();
});

describe('Default login', () => {
    it('should return 200 and a token for valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_DEFAULT_EMAIL,
                password: process.env.ADMIN_DEFAULT_PASSWORD
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invaliduser',
                password: 'invalidpassword'
            });
        expect(res.statusCode).toEqual(401);
    });
});

describe('Create user', () => {
    it('should return 201 for valid user creation with admin token', async () => {
        const uniqueId = Date.now();
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                username: `testuser_${uniqueId}`,
                email: `testuser_${uniqueId}@email.com`,
                password: 'testpassword',
                userGroups: [2]
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email');
        expect(res.body).not.toHaveProperty('password');
    });
});

describe('Invalid user creation', () => {
    it('should return 401 when token is missing', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                email: 'invaliduser@email.com'
            });
        expect(res.statusCode).toEqual(401);
    });
});

describe('Invalid login', () => {
    it('should return 401 for non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistentuser@email.com',
                password: 'invalidpassword'
            });
        expect(res.statusCode).toEqual(401);
    });
});

describe('Invalid login with wrong password', () => {
    it('should return 401 for wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_DEFAULT_EMAIL,
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
    });
});

describe('Invalid user creation with existing email', () => {
    it('should return 500 for existing email', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                username: 'duplicate-admin',
                email: process.env.ADMIN_DEFAULT_EMAIL,
                password: 'testpassword',
                userGroups: [2]
            });
        expect(res.statusCode).toEqual(500);
    });
});

describe('Invalid user creation with missing fields', () => {
    it('should return 400 for missing fields', async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'invaliduser@email.com'
            });
        expect(res.statusCode).toEqual(400);
    });
});


