function hi() {
  console.log("Hello World!");
}

// Bot configuration
module.exports = {
  config: {
    name: "chatbot",
    version: "1.1",
    author: "Efat Ahmed",
    shortDescription: "A fun chatbot",
    longDescription: "This is a chatbot with multiple fun and useful features.",
    category: "Fun",
    guide: {
      en: "Type /help to see the list of commands."
    }
  },
  onStart: async () => {
    console.log("Chatbot is now running!");
  },
  onChat: async function ({ message, event, api }) {
    const triggerWords = ["hello", "hi", "bot", "help"];
    const randomFacts = [
      "Did you know? Honey never spoils.",
      "Fun fact: Octopuses have three hearts!",
      "The Eiffel Tower can be 15 cm taller during the summer."
    ];

    if (!event.body) return;

    const userMessage = event.body.toLowerCase();

    // Greeting based on time of day
    const currentHour = new Date().getHours();
    let greeting = "Hello!";
    if (currentHour < 12) greeting = "Good morning!";
    else if (currentHour < 18) greeting = "Good afternoon!";
    else greeting = "Good evening!";

    // Check if message contains any trigger words
    if (triggerWords.some(word => userMessage.includes(word))) {
      return message.reply({
        body: `${greeting} How can I assist you today? Type /help for commands.`,
      });
    }

    // Command: /help
    if (userMessage === "/help") {
      return message.reply({
        body: "Here are some commands you can use:\n" +
              "- /help: Show this help message\n" +
              "- /about: Learn about this bot\n" +
              "- /fact: Get a random fun fact"
      });
    }

    // Command: /about
    if (userMessage === "/about") {
      return message.reply({
        body: "Hi! I'm a chatbot created by Efat Ahmed. I'm here to make your chats more fun and informative!"
      });
    }

    // Command: /fact
    if (userMessage === "/fact") {
      const randomFact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
      return message.reply({
        body: randomFact
      });
    }

    // Default response if no command or trigger word matches
    return message.reply({
      body: "I'm sorry, I didn't understand that. Type /help to see what I can do!"
    });
  }
};
