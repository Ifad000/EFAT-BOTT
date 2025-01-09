module.exports = {
  config: {
    name: "bot",
    version: "1.0",
    author: "Efat Ahmed",
    description: "Responds to 'bot' and 'bby'",
  },
  onChat: async function ({ message, event, api }) {
    const keywords = ["bot", "bby"];
    const responses = {
      bot: "Hi, I'm here! How can I assist you? 🤖",
      bby: "Hello there! What's up? 🥰",
    };

    if (!event.body) return;

    const userInput = event.body.toLowerCase();
    const matchedKeyword = keywords.find((keyword) => userInput.includes(keyword));

    if (matchedKeyword) {
      const response = responses[matchedKeyword];
      return message.reply({ body: response });
    }
  },
};
