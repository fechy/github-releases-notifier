import request from 'superagent';

export const doesRepositoryExist = async (repository) => {
    return await request.post('/api/exists', { repository });
};

export const storeRepository = async (repositoryData) => {
    return await request.post('/api/add', repositoryData);
};

export const getWatchList = async () => {
    return await request.get('/api/watch-list');
};

export const removeFromList = async (repository) => {
    return await request.post('/api/remove', { repository });
};