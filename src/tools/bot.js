/**
 * Controls a Telegram Bot to send a message
 */
const Bot = require('node-telegram-bot');
const { promisify } = require('util');

const config = require('../config');

const token = process.env.TELEGRAM_TOKEN || null;
const chatId = process.env.TELEGRAM_CHAT_ID || null;

if (config.environment !== 'test' && (!token || !chatId)) {
    console.error('Telegram Bot can\'t be started without a valid token or chat id');
}

const service = {
    bot: undefined,
    status: false,
    init() {
        if (service.bot === undefined) {
            service.bot = new Bot({
                token,
                parseCommand: false
            });
        }

        return service.bot;
    },

    isInitiated: () => service.bot !== undefined,

    getStatus: () => service.bot !== undefined && service.status,

    sendMessage: text => service.bot.sendMessage({ chat_id: chatId, text, parse_mode: 'HTML' }),

    on: (event, callback) => service.bot.on(event, callback),

    start: async () => {
        if (!service.status) {
            promisify(service.bot.start.bind(service.bot))();
            service.status = true;
        }

        return service.bot;
    },

    stop: async () => {
        if (service.status) {
            promisify(service.bot.stop.bind(service.bot))();
            service.status = false;
        }

        return service.bot;
    }
};

module.exports = service;