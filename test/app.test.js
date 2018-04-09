const request = require('supertest');
const app = require('../app');

const { databaseName } = require('../src/config');
const mongodb = require('../src/backend/mongodb');

const fakeRepository = {
    repository: 'fechy/github-releases-notifier',
    url: "https://github.com/fechy/github-releases-notifier/releases",
    last_updated: new Date('2017-11-21T00:00:00').toISOString()
};

jest.mock('../src/backend/getter');

describe('app', () => {
    // Set up database
    beforeAll(async () => {
        await mongodb.connect(`${databaseName}-test`);
    });

    afterAll(async () => {
        try {
            await mongodb.db.collection("repositories").drop();
            await mongodb.client.close(true);
        } catch (error) {
            throw error;
        }
    });

    afterEach(async () => {
        try {
            await mongodb.db.collection("repositories").remove();
        } catch (error) {
            throw error;
        }
    });

    test('It should response the GET method', async (done) => {
        const response = await request(app.callback()).get('/');

        expect(response.status).toBe(200);

        done();
    });

    test('It should ignore the POST method', async (done) => {
        const response = await request(app.callback()).post('/');

        expect(response.status).toBe(404);

        done();
    });

    test('It should return the status of the database', async (done) => {
        const response = await request(app.callback()).get('/api/db-status');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);

        done();
    });

    test('It should return the watch-list empty', async (done) => {
        const response = await request(app.callback()).get('/api/watch-list');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('collections');
        expect(response.body.collections).toHaveLength(0);

        done();
    });

    test('It should return the watch-list with one repository', async (done) => {
        const newRepo = Object.assign({}, fakeRepository);
        await mongodb.db.collection("repositories").insert(newRepo);

        const response = await request(app.callback()).get('/api/watch-list');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('collections');
        expect(response.body.collections).toHaveLength(1);

        done();
    });

    test('It should return false and error if the repository is not in a valid format', async (done) => {
        const fakeRepoName = 'fake-author---fake-value';
        const response = await request(app.callback()).post('/api/exists').send({ repository: fakeRepoName });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(`${fakeRepoName} is not a valid repository`);

        done();
    });

    test('It should return false if the repository doesnt exist', async (done) => {
        const response = await request(app.callback()).post('/api/exists').send({ repository: 'fake-author/fake-value' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('exists');
        expect(response.body.exists).toBe(false);

        done();
    });

    test('It should return true if the repository exist', async (done) => {
        const newRepo = Object.assign({}, fakeRepository);
        await mongodb.db.collection("repositories").insert(newRepo);

        const response = await request(app.callback()).post('/api/exists').send({ repository: newRepo.repository });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('exists');
        expect(response.body.exists).toBe(true);

        done();
    });

    test('It should fail to remove a repository that has a invalid format', async (done) => {
        const fakeRepoName = 'fake-author---fake-value';
        const response = await request(app.callback()).post('/api/remove').send({ repository: fakeRepoName });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(`${fakeRepoName} is not a valid repository`);

        done();
    });

    test('It should fail to remove a repository that is not in the watch-list', async (done) => {
        const repoName = fakeRepository.repository;
        const response = await request(app.callback()).post('/api/remove').send({ repository: repoName });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(`${repoName} is not in the watch-list`);

        done();
    });

    test('It should remove a repository that is in the watch-list', async (done) => {
        const newRepo = Object.assign({}, fakeRepository);
        await mongodb.db.collection("repositories").insert(newRepo);

        const response = await request(app.callback()).post('/api/remove').send({ repository: newRepo.repository });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toBe(true);

        done();
    });

    test('It should fail to add a repository that has a invalid URL', async (done) => {
        const invalidUrl = 'https://github.com/fechy/github-releases-notifier';
        const response = await request(app.callback()).post('/api/add').send({ url: invalidUrl });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(`Invalid URL given: ${invalidUrl}`);

        done();
    });

    test('It should add a repository that has a valid URL', async (done) => {
        const validUrl = fakeRepository.url;
        const response = await request(app.callback()).post('/api/add').send({ url: validUrl });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe(true);

        done();
    });

    test('It should fail to add a repository that already exists', async (done) => {
        const newRepo = Object.assign({}, fakeRepository);
        await mongodb.db.collection("repositories").insert(newRepo);

        const response = await request(app.callback()).post('/api/add').send({ url: newRepo.url });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(`${newRepo.repository} already exists`);

        done();
    });
});