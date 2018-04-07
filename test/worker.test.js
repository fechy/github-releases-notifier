// const expect = require('chai').expect;
const assert = require('assert');

const { databaseName } = require('../src/config');

const mongodb = require('../src/backend/mongodb');
const messageProcessor = require('../src/backend/worker.processor');

const fakeRepository = {
    repository: 'fechy/github-releases-notifier',
    url: "https://github.com/fechy/github-releases-notifier/releases",
    last_updated: new Date('2017-11-21T00:00:00').toISOString()
};

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

    afterEach(async () => {
        try {
            await db.collection("repositories").remove();
        } catch (error) {
            throw error;
        }
    });

    test('messages should be empty if there is no repository', async () =>
    {
        const messages = await messageProcessor(db);
        expect(messages).toHaveLength(0);
    });

    test('messages should return a nothing found message if there is no new release', async () =>
    {
        const newRepo = Object.assign({}, fakeRepository);
        await db.collection("repositories").insert(newRepo);
        
        const messages = await messageProcessor(db);
        expect(messages).toHaveLength(1);
        expect(messages[0]).toEqual('Nothing new for fechy/github-releases-notifier');
    });

    test('messages should a new release found message if there is a new release', async () =>
    {
        const newRepo = Object.assign({}, fakeRepository);
        newRepo.last_updated = new Date('2016-12-17T03:24:00').toISOString();

        await db.collection("repositories").insert(newRepo);

        const messages = await messageProcessor(db);
        expect(messages).toHaveLength(1);
        expect(messages[0]).toEqual('Found a new release for fechy/github-releases-notifier!');
    });

    test('repository last_check_at should be updated', async () =>
    {
        const newRepo = Object.assign({}, fakeRepository);
        await db.collection("repositories").insertOne(newRepo);
        
        const messages = await messageProcessor(db);
        expect(messages).toHaveLength(1);

        const collection = await db.collection("repositories").findOne({ repository: fakeRepository.repository });
        expect(collection.last_check_at).not.toBeNull();
    });

});