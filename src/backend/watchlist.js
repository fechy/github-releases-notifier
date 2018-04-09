
/** Returns the list of repositories watched */
const getList = async db => db.collection('repositories').find().toArray();

/** Returns the total number of repositories watched */
const getTotal = async (db, repository) => db.collection('repositories').find({ repository }).count();

/** Removes one repository */
const removeOne = async (db, repository) => db.collection('repositories').deleteOne({ repository });

/** Adds a new repository to watch */
const addOne = async (db, entry) => db.collection('repositories').insertOne(entry, { repository: 1, keepGoing: true });

module.exports = {
    getList,
    getTotal,
    removeOne,
    addOne
};