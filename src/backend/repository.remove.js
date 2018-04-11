import { isValidRepository } from '../tools/validator';
import { removeOne, getTotal } from './watchlist';

module.exports = async (db, repository) => {
    if (!isValidRepository(repository)) {
        throw new Error(`${repository} is not a valid repository`);
    }

    const count = await getTotal(db, repository);
    if (count === 0) {
        throw new Error(`${repository} is not in the watch-list`);
    }

    return removeOne(db, repository);
};