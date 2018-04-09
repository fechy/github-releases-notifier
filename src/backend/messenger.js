const { sendMessage } = require('../tools/bot');

const getFullMessage = messages => `<strong>Github releases bot results:</strong>\r\n<pre>${messages}</pre>`;

module.exports = async (messages) => {
    const message = getFullMessage(messages.join("\r\n"));
    return sendMessage(message);
};