const bot = {
    start: function () {

    },
    stop: function () {

    }
};
  
const sendMessage = (text) => {
    return Promise.resolve(text);
}

module.exports = {
    bot,
    sendMessage
}