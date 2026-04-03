const request = require('supertest');
const app = require('../app'); // Importa o servidor para os testes
const dotenv = require('dotenv');
const sequelize = require('../src/config/db').sequelize;
const setupAssociations = require('../src/models/associations.model');
const defaultGroupsSeed = require('../src/config/seeds/default.groups.seed');
const createDefaultAdminUser = require('../src/config/seeds/createAdmin.seed');
dotenv.config();

beforeAll(async () => {
    setupAssociations();
    await sequelize.authenticate();
    await defaultGroupsSeed();
    await createDefaultAdminUser();
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