const databaseName = 'github-notifier';
const environment = process.env.NODE_ENV || 'development';
const debug = environment == 'development';

module.exports = {
    environment,
    debug,
    databaseName
};