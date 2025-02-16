const fs = require("fs-extra");

const teachFile = "teachData.json";

// If file doesn't exist, create it
if (!fs.existsSync(teachFile)) {
  fs.writeFileSync(teachFile, JSON.stringify({}));
}

// Function to remove emojis and special characters
function removeSpecialChars(text) {
  return text
    .replace(/[^\w\s]/g, '') // Remove special characters except letters and spaces
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters (emojis and symbols)
    .trim(); // Remove extra spaces
}

module.exports = {
  config: {
    name: "teach",
    version: "1.0",
    author: "Efat",
    countDown: 5,
    role: 1, // Admin only
    shortDescription: {
      en: "Teach the bot custom replies (Admin only)",
    },
    longDescription: {
      en: "Allows group admins to teach the bot to reply to specific messages.",
    },
    category: "admin",
    guide: {
      en: "{pn} <trigger> | <response>",
    },
  },

  onStart: async function ({ message, args, event, api }) {
    const { threadID, senderID } = event;

    // Get thread info
    const threadInfo = await api.getThreadInfo(threadID);
    
    // Check if the user is an admin
    if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) {
      return message.reply("❌ Only admins can teach the bot!");
    }

    if (args.length < 3 || !args.includes("|")) {
      return message.reply("⚠️ **Correct format:** `{pn} Hello | Hi`");
    }

    const input = args.join(" ").split("|").map(item => item.trim());
    const trigger = removeSpecialChars(input[0].toLowerCase()); // Clean trigger
    const response = input[1]; // Response remains unchanged

    let teachData = JSON.parse(fs.readFileSync(teachFile, "utf8"));
    teachData[trigger] = response;

    fs.writeFileSync(teachFile, JSON.stringify(teachData, null, 2));

    message.reply(`✅ **"${trigger}"** has been taught! Now, when someone says "${trigger}", the bot will reply: *"${response}"*`);
  },

  onChat: async function ({ message, event }) {
    const { body } = event;
    if (!body) return;

    let teachData = JSON.parse(fs.readFileSync(teachFile, "utf8"));
    const lowerBody = removeSpecialChars(body.toLowerCase()); // Clean user input

    // Check if the message matches a taught trigger and reply
    if (teachData[lowerBody]) {
      message.reply(teachData[lowerBody]);
    }
  },
};
