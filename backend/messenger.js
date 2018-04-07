const { sendMessage } = require('../src/tools/bot');

const getFullMessage = (messages) => {
    return `<strong>Github releases bot results:</strong>\r\n<pre>${messages}</pre>`;
}

module.exports = async (messages) => {
    const message = getFullMessage(messages.join("\r\n"));
    return await sendMessage(message);
}