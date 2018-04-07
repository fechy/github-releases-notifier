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
            await db.collection("repositories").remove();
            await client.close();
        } catch (error) {
            throw error;
        }
    });

    describe('database', function () {

        test('should be connected', function () {
            assert.ok(client.isConnected());
        });
    });

    describe('worker', function () {

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

});