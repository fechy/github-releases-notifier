const { isValidUrl, getRepositoryURL } = require('../src/tools/validator');

describe('validator',  function ()
{
    test('should fail if empty url', function () {
        expect(isValidUrl("")).toBe(false);
    });

    test('should fail if no valid url format', function () {
        expect(isValidUrl("https://github.com-fechy-github-releases-notifier")).toBe(false);
    });

    test('should fail if no valid github release url', function () {
        expect(isValidUrl("https://github.com/fechy/github-releases-notifier")).toBe(false);
    });

    test('should pass if valid github release url', function () {
        expect(isValidUrl("https://github.com/fechy/github-releases-notifier/releases")).toBe(true);
    });

    test('should return null if no valid url is passed to get repository', function () {
        expect(getRepositoryURL("https://github.com/fechy/github-releases-notifier")).toBe(null);
    });

    test('should return the repository URL if valid url is passed to get repository', function () {
        expect(getRepositoryURL("https://github.com/fechy/github-releases-notifier/releases")).toBe("fechy/github-releases-notifier");
    });
});