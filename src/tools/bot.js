/**
 * Controls a Telegram Bot to send a message
 */
const Bot = require('node-telegram-bot');

const token = process.env.TELEGRAM_TOKEN || null;
const chatId = process.env.TELEGRAM_CHAT_ID || null;

if (!token || chatId) {
  console.error('Telegram Bot can\'t be started without a valid token or chat id');
}

const bot = new Bot({
  token: token,
  parseCommand: false
});

const sendMessage = (text) => bot.sendMessage({ chat_id: chatId, text: text, parse_mode: 'HTML' });

module.exports = {
    bot,
    sendMessage
}