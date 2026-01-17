import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import User from '../src/models/User.js';

describe('Auth Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('user');
            expect(res.body.user.email).to.equal(userData.email);

            const user = await User.findOne({ email: userData.email });
            expect(user).to.not.be.null;
        });

        it('should fail if email already exists', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123'
            };

            await User.create(userData);

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).to.equal(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'login@example.com',
                password: 'password123'
            };

            await request(app).post('/api/auth/register').send(userData);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('accessToken');
        });

        it('should fail with incorrect password', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'wrong@example.com',
                password: 'password123'
            };

            await request(app).post('/api/auth/register').send(userData);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: 'wrongpassword'
                });

            expect(res.status).to.equal(401);
        });
    });

    describe('PUT /api/users/profile/me', () => {
        let token;
        beforeEach(async () => {
            const userData = {
                firstName: 'Profile',
                lastName: 'Test',
                email: 'profile@example.com',
                password: 'password123'
            };
            await request(app).post('/api/auth/register').send(userData);
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                });
            token = res.body.accessToken;
        });

        it('should update profile successfully', async () => {
            const res = await request(app)
                .put('/api/users/profile/me')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedProfile',
                    lastName: 'UpdatedLast'
                });

            expect(res.status).to.equal(200);
            expect(res.body.firstName).to.equal('UpdatedProfile');
        });

        it('should fail to update to an existing email', async () => {
            // Register another user to collide with
            await request(app).post('/api/auth/register').send({
                firstName: 'Exist',
                lastName: 'User',
                email: 'exist@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .put('/api/users/profile/me')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: 'exist@example.com'
                });

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Email already in use');
        });
    });
});
