const handleConversation = require('../src/backend/conversations');
const mongodb = require('../src/backend/mongodb');

const { databaseName } = require('../src/config');

jest.mock('../src/tools/bot');

const fakeRepository = {
    repository: 'fechy/github-releases-notifier',
    url: "https://github.com/fechy/github-releases-notifier/releases",
    last_updated: new Date('2017-11-21T00:00:00').toISOString()
};

describe('validator',  function () {
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

    test('should handle empty command and return \"Empty message\"', async () => {
        const result = await handleConversation(null, db);
        expect(result).toBe("Empty message");
    });

    test('should return list of available commands if invalid command is given', async () => {
        const result = await handleConversation({ text: 'invalid' }, db);
        expect(result).toContain("Valid commands:");
    });

    test('should return list of available commands if /help command is given', async () => {
        const result = await handleConversation({ text: '/help' }, db);
        expect(result).toContain("Valid commands:");
    });

    test('should return list of available commands if unrecognized command is given', async () => {
        const result = await handleConversation({ text: '/invalid' }, db);
        expect(result).toContain("Valid commands:");
    });

    test('should return test data if /test command is given', async () => {
        const result = await handleConversation({ text: '/test' }, db);
        expect(result).toContain("Test CMD recived: test. Params: ");
    });

    test('should return test data if /test command is given with params', async () => {
        const result = await handleConversation({ text: '/test my fake params' }, db);
        expect(result).toContain("Test CMD recived: test. Params: my fake params");
    });

    test('should return watch-list if /list command is given', async () => {
        const result = await handleConversation({ text: '/list' }, db);
        expect(result).toContain("<strong>Here's your watch list:</strong>");
    });

    test('should fail to add repository if /add command is given with empty URL', async () => {
        const result = await handleConversation({ text: '/add' }, db);
        expect(result).toContain("No valid url was given");
    });

    test('should fail to add repository if /add command is given with invalid URL', async () => {
        const result = await handleConversation({ text: '/add not-a-valid-url' }, db);
        expect(result).toContain("Invalid URL given: not-a-valid-url");
    });

    test('should fail to add repository if /add command is given with invalid Github URL', async () => {
        const result = await handleConversation({ text: '/add https://github.com/fechy/github-releases-notifier' }, db);
        expect(result).toContain("Invalid URL given");
    });

    test('should add repository to watch-list if /add command is given', async () => {
        const result = await handleConversation({ text: `/add ${fakeRepository.url}` }, db);
        expect(result).toContain("added to the list");
    });

    test('should continue silently to add repository to watch-list if already exist', async () => {
        const newRepo = Object.assign({}, fakeRepository);
        await db.collection("repositories").insert(newRepo);

        const result = await handleConversation({ text: `/add ${fakeRepository.url}` }, db);
        expect(result).toContain("added to the list");
    });

    test('should fail if /remove command is given with no params', async () => {
        const result = await handleConversation({ text: `/remove` }, db);
        expect(result).toContain("No repository given");
    });

    test('should fail to remove repository from watch-list if no valid repository is given', async () => {
        const result = await handleConversation({ text: `/remove not-a-repo` }, db);
        expect(result).toContain("not-a-repo is not a valid repository");
    });

    test('should fail to remove repository from watch-list if repository is not in the watch list', async () => {
        const result = await handleConversation({ text: `/remove valid/repo` }, db);
        expect(result).toContain("valid/repo is not in the watch-list");
    });

    test('should remove repository from watch-list if /remove command is given', async () => {
        const newRepo = Object.assign({}, fakeRepository);
        await db.collection("repositories").insert(newRepo);

        const prevCount = await db.collection('repositories').find({ repository: fakeRepository.repository }).count();
        expect(prevCount).toBe(1);

        const result = await handleConversation({ text: `/remove ${fakeRepository.repository}` }, db);
        expect(result).toContain(`${fakeRepository.repository} removed from the watch list`);

        const afterCount = await db.collection('repositories').find({ repository: fakeRepository.repository }).count();
        expect(afterCount).toBe(0);
    });
});