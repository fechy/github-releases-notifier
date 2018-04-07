const expect = require('chai').expect;
const assert = require('assert');

const { databaseName } = require('../src/config');

const mongodb = require('../src/backend/mongodb');
const messageProcessor = require('../src/backend/worker.processor');

const fakeRepository = {
    repository: 'fechy/github-releases-notifier',
    url: "https://github.com/fechy/github-releases-notifier/releases",
    updated_at: new Date().toISOString()
}

jest.mock('../src/backend/getter');

describe('worker',  function () {

    let client;
    let db;

    // Set up database
    beforeAll(async () => {
        client = await mongodb();
        db = await client.db(databaseName + '-test');
    });

    afterAll(async () => {
        try {
            await db.collection("repositories").drop();
            await client.close(true);
        } catch (error) {
            throw error;
        }
    });

    test('should be empty if there is no repository', async () => {
        try {
            const messages = await messageProcessor(db);
            expect(messages).to.be.a('array');
            expect(messages).to.have.lengthOf(0);
        } catch (err) {
            console.log({ err });
        }
    });

    test('should not be empty if there is a repository', async () => {
        try {
            await db.collection("repositories").insert(fakeRepository);
            const messages = await messageProcessor(db);
            expect(messages).to.be.a('array');
            expect(messages).to.have.lengthOf(1);
        } catch (err) {
            console.log({ err });
        }
    });

});