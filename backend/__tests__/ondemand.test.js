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

describe('Create on-demand as admin',  () => {
	it('should return 201 for valid on-demand creation with admin token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand ${uniqueId}`,
				user_id: adminId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test on-demand subtitle ${uniqueId}`,
				description: `This is a test on-demand description ${uniqueId}`,
				video_url: `https://example.com/video-${uniqueId}.mp4`,
				thumbnail_url: `https://example.com/thumbnail-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.title).toBe(`Test OnDemand ${uniqueId}`);
	});
});

describe('Create on-demand as non-admin', () => {
	it('should return 403 for on-demand creation with non-admin token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Test OnDemand ${uniqueId}`,
				user_id: studentId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test on-demand subtitle ${uniqueId}`,
				description: `This is a test on-demand description ${uniqueId}`,
				video_url: `https://example.com/video-${uniqueId}.mp4`,
				thumbnail_url: `https://example.com/thumbnail-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Create on-demand without token', () => {
	it('should return 401 for on-demand creation without token', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/ondemand')
			.send({
				title: `Test OnDemand ${uniqueId}`,
				user_id: studentId,
				category: `Education ${uniqueId}`,
				theme: `Technology ${uniqueId}`,
				subtitle: `This is a test on-demand subtitle ${uniqueId}`,
				description: `This is a test on-demand description ${uniqueId}`,
				video_url: `https://example.com/video-${uniqueId}.mp4`,
				thumbnail_url: `https://example.com/thumbnail-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(401);
	});
});

describe('Get all on-demand as admin', () => {
	it('should return 200 and an array of on-demand with admin token', async () => {
		const res = await request(app)
			.get('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('Get all on-demand as non-admin', () => {
	it('should return 200 and an array of on-demand with non-admin token', async () => {
		const res = await request(app)
			.get('/api/ondemand')
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('Get all on-demand without token', () => {
	it('should return 401 for getting on-demand without token', async () => {
		const res = await request(app)
			.get('/api/ondemand');
		expect(res.statusCode).toEqual(401);
	});
});

describe('Get on-demand by ID as admin', () => {
	it('should return 200 and the on-demand with admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for GetById`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for GetById`,
				description: `This is a test on-demand description for GetById`,
				video_url: 'https://example.com/get-by-id.mp4',
				thumbnail_url: 'https://example.com/get-by-id.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.get(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', onDemandId);
	});
});

describe('Get on-demand by ID as non-admin', () => {
	it('should return 200 and the on-demand with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for GetById Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for GetById Non-Admin`,
				description: `This is a test on-demand description for GetById Non-Admin`,
				video_url: 'https://example.com/get-by-id-non-admin.mp4',
				thumbnail_url: 'https://example.com/get-by-id-non-admin.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.get(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', onDemandId);
	});
});

describe('Get on-demand by ID without token', () => {
	it('should return 401 for getting on-demand by ID without token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for GetById No Token`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for GetById No Token`,
				description: `This is a test on-demand description for GetById No Token`,
				video_url: 'https://example.com/get-by-id-no-token.mp4',
				thumbnail_url: 'https://example.com/get-by-id-no-token.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.get(`/api/ondemand/${onDemandId}`);
		expect(res.statusCode).toEqual(401);
	});
});

describe('Create on-demand as non-admin with student ID', () => {
	it('should return 403 for on-demand creation with non-admin token and student ID', async () => {
		const uniqueId = Date.now();
		const res = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Test OnDemand for Non-Admin ${uniqueId}`,
				user_id: studentId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for Non-Admin ${uniqueId}`,
				description: `This is a test on-demand description for Non-Admin ${uniqueId}`,
				video_url: `https://example.com/non-admin-${uniqueId}.mp4`,
				thumbnail_url: `https://example.com/non-admin-${uniqueId}.jpg`,
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Update on-demand as admin', () => {
	it('should return 200 for valid on-demand update with admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for Update`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for Update`,
				description: `This is a test on-demand description for Update`,
				video_url: 'https://example.com/update.mp4',
				thumbnail_url: 'https://example.com/update.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.put(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Updated Test OnDemand for Update`,
				category: `Updated Education`,
				theme: `Updated Technology`,
				subtitle: `This is an updated test on-demand subtitle for Update`,
				description: `This is an updated test on-demand description for Update`,
				video_url: 'https://example.com/update-new.mp4',
				thumbnail_url: 'https://example.com/update-new.jpg',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('id', onDemandId);
		expect(res.body.title).toBe(`Updated Test OnDemand for Update`);
	});
});

describe('Update on-demand as non-admin', () => {
	it('should return 403 for on-demand update with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for Update Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for Update Non-Admin`,
				description: `This is a test on-demand description for Update Non-Admin`,
				video_url: 'https://example.com/update-non-admin.mp4',
				thumbnail_url: 'https://example.com/update-non-admin.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.put(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${studentToken}`)
			.send({
				title: `Updated Test OnDemand for Update Non-Admin`,
				category: `Updated Education`,
				theme: `Updated Technology`,
				subtitle: `This is an updated test on-demand subtitle for Update Non-Admin`,
				description: `This is an updated test on-demand description for Update Non-Admin`,
				video_url: 'https://example.com/update-non-admin-new.mp4',
				thumbnail_url: 'https://example.com/update-non-admin-new.jpg',
			});
		expect(res.statusCode).toEqual(403);
	});
});

describe('Delete on-demand as admin', () => {
	it('should return 200 for valid on-demand deletion with admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for Deletion`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for Deletion`,
				description: `This is a test on-demand description for Deletion`,
				video_url: 'https://example.com/delete.mp4',
				thumbnail_url: 'https://example.com/delete.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.delete(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(200);
	});
});

describe('Delete on-demand as non-admin', () => {
	it('should return 403 for on-demand deletion with non-admin token', async () => {
		const createRes = await request(app)
			.post('/api/ondemand')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: `Test OnDemand for Deletion Non-Admin`,
				user_id: adminId,
				category: `Education`,
				theme: `Technology`,
				subtitle: `This is a test on-demand subtitle for Deletion Non-Admin`,
				description: `This is a test on-demand description for Deletion Non-Admin`,
				video_url: 'https://example.com/delete-non-admin.mp4',
				thumbnail_url: 'https://example.com/delete-non-admin.jpg',
			});
		const onDemandId = createRes.body.id;
		const res = await request(app)
			.delete(`/api/ondemand/${onDemandId}`)
			.set('Authorization', `Bearer ${studentToken}`);
		expect(res.statusCode).toEqual(403);
	});
});
