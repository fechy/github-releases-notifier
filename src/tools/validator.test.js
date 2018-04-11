import { isValidUrl, getRepositoryURL } from './validator';

describe('validator', () => {
    test('should fail if empty url', () => {
        expect(isValidUrl("")).toBe(false);
    });

    test('should fail if no valid url format', () => {
        expect(isValidUrl("https://github.com-fechy-github-releases-notifier")).toBe(false);
    });

    test('should fail if no valid github release url', () => {
        expect(isValidUrl("https://github.com/fechy/github-releases-notifier")).toBe(false);
    });

    test('should pass if valid github release url', () => {
        expect(isValidUrl("https://github.com/fechy/github-releases-notifier/releases")).toBe(true);
    });

    test('should return null if no valid url is passed to get repository', () => {
        expect(getRepositoryURL("https://github.com/fechy/github-releases-notifier")).toBe(null);
    });

    test('should return the repository URL if valid url is passed to get repository', () => {
        expect(getRepositoryURL("https://github.com/fechy/github-releases-notifier/releases")).toBe("fechy/github-releases-notifier");
    });
});