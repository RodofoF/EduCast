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

describe('Create live as admin',  () => {
	it('should return 201 for valid live creation with admin token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live ${uniqueId}`,
				user_id: adminId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test live subtitle ${uniqueId}`,
				description: `This is a test live description ${uniqueId}`,
				video_url: `https://example.com/live-${uniqueId}.m3u8`,
				thumbnail_url: `https://example.com/live-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.title).toBe(`Test Live ${uniqueId}`);
	});
});

describe('Create live as non-admin', () => {
	it('should return 403 for live creation with non-admin token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Test Live ${uniqueId}`,
				user_id: studentId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test live subtitle ${uniqueId}`,
				description: `This is a test live description ${uniqueId}`,
				video_url: `https://example.com/live-${uniqueId}.m3u8`,
				thumbnail_url: `https://example.com/live-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Create live without token', () => {
	it('should return 401 for live creation without token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/live')
			.send({
				title: `Test Live ${uniqueId}`,
				user_id: studentId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test live subtitle ${uniqueId}`,
				description: `This is a test live description ${uniqueId}`,
				video_url: `https://example.com/live-${uniqueId}.m3u8`,
				thumbnail_url: `https://example.com/live-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(401);
	});
});

describe('Get all live as admin', () => {
	it('should return 200 and an array of live with admin token', async () => {
		const res = await request(app)
			.get('/api/live')
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('Get all live as non-admin', () => {
	it('should return 200 and an array of live with non-admin token', async () => {
		const res = await request(app)
			.get('/api/live')
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('Get all live without token', () => {
	it('should return 401 for getting live without token', async () => {
		const res = await request(app)
			.get('/api/live');
		expect(res.statusCode).toEqual(401);
	});
});

describe('Get live by ID as admin', () => {
	it('should return 200 and the live with admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for GetById`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for GetById`,
				description: `This is a test live description for GetById`,
				video_url: 'https://example.com/live-get-by-id.m3u8',
				thumbnail_url: 'https://example.com/live-get-by-id.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.get(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', liveId);
	});
});

describe('Get live by ID as non-admin', () => {
	it('should return 200 and the live with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for GetById Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for GetById Non-Admin`,
				description: `This is a test live description for GetById Non-Admin`,
				video_url: 'https://example.com/live-get-by-id-non-admin.m3u8',
				thumbnail_url: 'https://example.com/live-get-by-id-non-admin.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.get(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', liveId);
	});
});

describe('Get live by ID without token', () => {
	it('should return 401 for getting live by ID without token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for GetById No Token`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for GetById No Token`,
				description: `This is a test live description for GetById No Token`,
				video_url: 'https://example.com/live-get-by-id-no-token.m3u8',
				thumbnail_url: 'https://example.com/live-get-by-id-no-token.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.get(`/api/live/${liveId}`);
		expect(res.statusCode).toEqual(401);
	});
});

describe('Create live as non-admin with student ID', () => {
	it('should return 403 for live creation with non-admin token and student ID', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Test Live for Non-Admin ${uniqueId}`,
				user_id: studentId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for Non-Admin ${uniqueId}`,
				description: `This is a test live description for Non-Admin ${uniqueId}`,
				video_url: `https://example.com/live-non-admin-${uniqueId}.m3u8`,
				thumbnail_url: `https://example.com/live-non-admin-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Update live as admin', () => {
	it('should return 200 for valid live update with admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for Update`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for Update`,
				description: `This is a test live description for Update`,
				video_url: 'https://example.com/live-update.m3u8',
				thumbnail_url: 'https://example.com/live-update.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.put(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Updated Test Live for Update`,
				category: `Updated Education`,
				theme: `Updated Technology`,
				subtitle: `This is an updated test live subtitle for Update`,
				description: `This is an updated test live description for Update`,
				video_url: 'https://example.com/live-update-new.m3u8',
				thumbnail_url: 'https://example.com/live-update-new.jpg',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', liveId);
		expect(res.body.title).toBe(`Updated Test Live for Update`);
	});
});

describe('Update live as non-admin', () => {
	it('should return 403 for live update with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for Update Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for Update Non-Admin`,
				description: `This is a test live description for Update Non-Admin`,
				video_url: 'https://example.com/live-update-non-admin.m3u8',
				thumbnail_url: 'https://example.com/live-update-non-admin.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.put(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Updated Test Live for Update Non-Admin`,
				category: `Updated Education`,
				theme: `Updated Technology`,
				subtitle: `This is an updated test live subtitle for Update Non-Admin`,
				description: `This is an updated test live description for Update Non-Admin`,
				video_url: 'https://example.com/live-update-non-admin-new.m3u8',
				thumbnail_url: 'https://example.com/live-update-non-admin-new.jpg',
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Delete live as admin', () => {
	it('should return 200 for valid live deletion with admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for Deletion`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for Deletion`,
				description: `This is a test live description for Deletion`,
				video_url: 'https://example.com/live-delete.m3u8',
				thumbnail_url: 'https://example.com/live-delete.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.delete(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
	});
});

describe('Delete live as non-admin', () => {
	it('should return 403 for live deletion with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/live')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test Live for Deletion Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test live subtitle for Deletion Non-Admin`,
				description: `This is a test live description for Deletion Non-Admin`,
				video_url: 'https://example.com/live-delete-non-admin.m3u8',
				thumbnail_url: 'https://example.com/live-delete-non-admin.jpg',
			});
		const liveId = createRes.body.id;
		const res = await request(app)
			.delete(`/api/live/${liveId}`)
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(403);
	});
});
