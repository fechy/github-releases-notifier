const { isValidRepository } = require('../tools/validator');
const { removeOne, getTotal } = require('./watchlist');

module.exports = async (db, repository) => {

    if (!isValidRepository(repository)) {
        throw new Error(`${repository} is not a valid repository`);
    }

    const count = await getTotal(db, repository);
    if (count == 0) {
        throw new Error(`${repository} is not in the watch-list`);
    }

    return await removeOne(db, repository);
}