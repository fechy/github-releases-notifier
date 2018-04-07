import request from 'superagent';

export const doesRepositoryExist = (repository) => {
    return request.post('/api/exists', { repository });
};

export const storeRepository = (repositoryData) => {
    return request.post('/api/store-url', repositoryData);
};

export const getWatchList = () => {
    return request.get('/api/watch-list');
};

export const removeFromList = (repository) => {
    return request.post('/api/remove', { repository });
};