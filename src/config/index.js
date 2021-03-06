const databaseName = 'github-notifier';
const environment = process.env.NODE_ENV || 'development';
const debug = environment === 'development';

const sendMessagesForNotFoundReleases = !debug;

module.exports = {
    environment,
    debug,
    databaseName,
    sendMessagesForNotFoundReleases
};