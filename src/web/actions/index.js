import request from 'superagent';

export const doesRepositoryExist = async repository => request.post('/api/exists', { repository });

export const storeRepository = async repositoryData => request.post('/api/add', repositoryData);

export const getWatchList = async () => request.get('/api/watch-list');

export const removeFromList = async repository => request.post('/api/remove', { repository });