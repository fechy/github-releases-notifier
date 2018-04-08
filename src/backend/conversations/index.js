const { getList, getTotal, removeOne } = require('../watchlist');
const { sendMessage } = require('../../tools/bot');
const { isValidRepository } = require('../../tools/validator');

const repositoryAdd = require('../repository.add');
const repositoryRemove = require('../repository.remove');

const pattern = /^\/([a-z0-9]*)[\s]{0,}(.{0,})/i;

const resolveCommand = function (command) {
    if (command.startsWith('/')) {
        const cmd = command.match(pattern);
        return {
            action: cmd[1],
            params: cmd[2]
        };
    }

    return null;
}

const helpCmd = () => {
    const message = [];
    message.push(`Valid commands:`);
    message.push(`/list - Returns the list of watched repositories`);
    message.push(`/add - Adds a new repository to the watch list`);
    message.push(`/remove - Removes a repository from the watch list`);
    message.push(`/test - Tests this bot`);

    return message.join("\r\n");
}

const invalidCmd = function (cmd) {
    const message = [];
    if (cmd != null) {
        message.push(`Invalid command received: ${cmd.action}`);
    } else {
        message.push(`Empty command received`);
    }

    message.push("\r\n");
    message.push(helpCmd());

    return message.join("\r\n");
}

const resolveTestCmd = function (cmd) {
    return `Test CMD recived: ${cmd.action}. Params: ${cmd.params}`;
}

const resolveListCmd = async (cmd, db) => {
    let message = [];
    try {
        message.push(`<strong>Here's your watch list:</strong>`);

        const list = await getList(db);
        const repositories = list.map( collection => `- ${collection.repository}` );
        message = message.concat(repositories);
    } catch (err) {
        message.push(`<strong>Error processing your list:</strong> ${err}`);
    }

    return message.join("\r\n");
}

const resolveAddCmd = async (cmd, db) => {

    try {
        const url = cmd.params;
        if (!url) {
            throw new Error(`No valid url was given`);
        }
        
        const result = await repositoryAdd(db, url);
        if (!result) {
            return `${url} failed to be added to the list`;
        }

        return `${result.repository} added to the list`;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

const resolveRemoveCmd = async (cmd, db) => {
    try {
        const repository = cmd.params;
        if (!repository) {
            throw new Error('No repository given');
        }

        const result = await repositoryRemove(db, repository);
        if (!result) {
            return `${repository} failed to be removed from the watch list`;
        }

        return `${repository} removed from the watch list`;
    } catch (error) {
        return error.message ? error.message : error;
    }
};

module.exports = async (message, db) => {
    try {
        if (!message) {
            throw new Error('Empty message');
        }

        let responseMsg = `Unkown issue`;
        const cmd = resolveCommand(message.text);
        if (cmd) {
            switch (cmd.action) {
                case 'test':
                    responseMsg = resolveTestCmd(cmd);
                    break;

                case 'list':
                    responseMsg = await resolveListCmd(cmd, db);
                    break;

                case 'add':
                    responseMsg = await resolveAddCmd(cmd, db);
                    break;

                case 'remove':
                    responseMsg = await resolveRemoveCmd(cmd, db);
                    break;

                case 'start':
                    responseMsg = 'This bot is already started';
                    break;

                case 'help':
                    responseMsg = helpCmd();
                    break;
                    
                default:
                    responseMsg = invalidCmd(cmd);
                    break;
            }
        } else {
            responseMsg = invalidCmd(cmd);
        }

        return await sendMessage(responseMsg);
    } catch (err) {
        let errorMessage = err.message ? err.message : err;
        return await sendMessage(errorMessage);
    }
};