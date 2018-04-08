/**
 * Controls a Telegram Bot to send a message
 */
const Bot = require('node-telegram-bot');

const token = process.env.TELEGRAM_TOKEN || null;
const chatId = process.env.TELEGRAM_CHAT_ID || null;

const bot = new Bot({
  token: token
});

const sendMessage = (text) => bot.sendMessage({ chat_id: chatId, text: text, parse_mode: 'HTML' });

module.exports = {
    sendMessage
}