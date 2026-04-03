const request = require('supertest');
const app = require('../app'); // Importa o servidor para os testes
const dotenv = require('dotenv');
const sequelize = require('../src/config/db').sequelize;
const setupAssociations = require('../src/models/associations.model');
const defaultGroupsSeed = require('../src/config/seeds/default.groups.seed');
const createDefaultAdminUser = require('../src/config/seeds/createAdmin.seed');
const createDefaultStudentUser = require('../src/config/seeds/createStudent.seed');
dotenv.config();

let adminToken;
let adminId;
let studentToken;
let studentId;

beforeAll(async () => {
    setupAssociations();
    await sequelize.authenticate();
    await defaultGroupsSeed();
    await createDefaultAdminUser();
    await createDefaultStudentUser();


    // Fazer login para obter o token de autenticação do admin
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: process.env.ADMIN_DEFAULT_EMAIL,
            password: process.env.ADMIN_DEFAULT_PASSWORD
        });
    const loginStudentRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: process.env.STUDENT_DEFAULT_EMAIL,
            password: process.env.STUDENT_DEFAULT_PASSWORD
        });
        console.log('Admin login response:', loginRes.body);
        console.log('Student login response:', loginStudentRes.body);

    adminToken = loginRes.body.token;
    adminId = loginRes.body.user.id;
    console.log('Admin ID:', adminId);
    studentToken = loginStudentRes.body.token;
    studentId = loginStudentRes.body.user.id;
});

afterAll(async () => {
    // Fechar o servidor após os testes para evitar conexões pendentes
    await sequelize.close();
});

describe('Create content as admin',  () => {
    it('should return 201 for valid content creation with admin token', async () => {
        const uniqueId = Date.now();
        const res = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content ${uniqueId}`,
                user_id: adminId,
                category: `Education ${uniqueId}`,
                theme: `Technology ${uniqueId}`,
                subtitle: `This is a test content subtitle ${uniqueId}`,
                content: `This is a test content body ${uniqueId}`,
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(`Test Content ${uniqueId}`);
    });
});

describe('Create content as non-admin', () => {
    it('should return 403 for content creation with non-admin token', async () => {
        const uniqueId = Date.now();
        const res = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                title: `Test Content ${uniqueId}`,
                user_id: studentId, 
                category: `Education ${uniqueId}`,
                theme: `Technology ${uniqueId}`,
                subtitle: `This is a test content subtitle ${uniqueId}`,
                content: `This is a test content body ${uniqueId}`,
            });
        expect(res.statusCode).toEqual(403);
    });
});