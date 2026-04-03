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

describe('Create content without token', () => {
    it('should return 401 for content creation without token', async () => {
        const uniqueId = Date.now();
        const res = await request(app)
            .post('/api/content')
            .send({
                title: `Test Content ${uniqueId}`,
                user_id: studentId, 
                category: `Education ${uniqueId}`,
                theme: `Technology ${uniqueId}`,
                subtitle: `This is a test content subtitle ${uniqueId}`,
                content: `This is a test content body ${uniqueId}`,
            });
        expect(res.statusCode).toEqual(401);
    });
});

describe('Get all content as admin', () => {
    it('should return 200 and an array of content with admin token', async () => {
        const res = await request(app)
            .get('/api/content')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('Get all content as non-admin', () => {
    it('should return 200 and an array of content with non-admin token', async () => {
        const res = await request(app)
            .get('/api/content')
            .set('Authorization', `Bearer ${studentToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('Get all content without token', () => {
    it('should return 401 for getting content without token', async () => {
        const res = await request(app)
            .get('/api/content');
        expect(res.statusCode).toEqual(401);
    });
});

describe('Get content by ID as admin', () => {
    it('should return 200 and the content with admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for GetById`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for GetById`,
                content: `This is a test content body for GetById`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .get(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', contentId);
    });
});

describe('Get content by ID as non-admin', () => {
    it('should return 200 and the content with non-admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for GetById Non-Admin`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for GetById Non-Admin`,
                content: `This is a test content body for GetById Non-Admin`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .get(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${studentToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', contentId);
    });
});

describe('Get content by ID without token', () => {
    it('should return 401 for getting content by ID without token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for GetById No Token`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for GetById No Token`,
                content: `This is a test content body for GetById No Token`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .get(`/api/content/${contentId}`);
        expect(res.statusCode).toEqual(401);
    });
});

describe('Create content as non-admin with student ID', () => {
    it('should return 403 for content creation with non-admin token and student ID', async () => {
        const uniqueId = Date.now();
        const res = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                title: `Test Content for Non-Admin ${uniqueId}`,
                user_id: studentId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for Non-Admin ${uniqueId}`,
                content: `This is a test content body for Non-Admin ${uniqueId}`,
            });
        expect(res.statusCode).toEqual(403);
    });
});

describe('Update content as admin', () => {
    it('should return 200 for valid content update with admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for Update`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for Update`,
                content: `This is a test content body for Update`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .put(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Updated Test Content for Update`,
                category: `Updated Education`,
                theme: `Updated Technology`,
                subtitle: `This is an updated test content subtitle for Update`,
                content: `This is an updated test content body for Update`,
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', contentId);
        expect(res.body.title).toBe(`Updated Test Content for Update`);
    });
});

describe('Update content as non-admin', () => {
    it('should return 403 for content update with non-admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for Update Non-Admin`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for Update Non-Admin`,
                content: `This is a test content body for Update Non-Admin`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .put(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                title: `Updated Test Content for Update Non-Admin`,
                category: `Updated Education`,
                theme: `Updated Technology`,
                subtitle: `This is an updated test content subtitle for Update Non-Admin`,
                content: `This is an updated test content body for Update Non-Admin`,
            });
        expect(res.statusCode).toEqual(403);
    });
});

describe('Delete content as admin', () => {
    it('should return 200 for valid content deletion with admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for Deletion`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for Deletion`,
                content: `This is a test content body for Deletion`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .delete(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });
});

describe('Delete content as non-admin', () => {
    it('should return 403 for content deletion with non-admin token', async () => {
        const createRes = await request(app)
            .post('/api/content')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: `Test Content for Deletion Non-Admin`,
                user_id: adminId,
                category: `Education`,
                theme: `Technology`,
                subtitle: `This is a test content subtitle for Deletion Non-Admin`,
                content: `This is a test content body for Deletion Non-Admin`,
            });
        const contentId = createRes.body.id;
        const res = await request(app)
            .delete(`/api/content/${contentId}`)
            .set('Authorization', `Bearer ${studentToken}`);
        expect(res.statusCode).toEqual(403);
    });
});