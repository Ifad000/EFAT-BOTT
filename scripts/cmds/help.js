const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.0",
    author: "Efat-X",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Show command list & usage guide",
    },
    longDescription: {
      en: "Displays all available commands with descriptions and usage guides.",
    },
    category: "info",
    guide: {
      en: "{pn} [command name]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      let msg = `
╔═════════════════╗
║  🚀 *EFAT-X BOT* 🚀  ║
║  🔥 *COMMAND LIST* 🔥  ║
╚═════════════════╝

🔻 *Available Commands:*  
`;

      const categories = {};
      let count = 1;

      for (const [name, cmd] of commands) {
        if (cmd.config.role > 1 && role < cmd.config.role) continue;

        const category = cmd.config.category || "Uncategorized";
        categories[category] = categories[category] || [];
        categories[category].push(name);
      }

      Object.entries(categories).forEach(([category, cmds]) => {
        if (category !== "info") {
          msg += `\n📂 *${category.toUpperCase()}*`;
          cmds.sort().forEach((cmd) => {
            msg += `\n  ➤ [${count}] ✨ *${cmd}*`;
            count++;
          });
        }
      });

      msg += `
━━━━━━━━━━━━━━━━━━━━━━
🔹 *Total Commands:* ${commands.size}  
🔹 *Bot Owner:* Efat-X  
🔹 *Support:* [Click Here](https://m.me/Efat27.bby.bot)  
🔹 "The strongest one is the one who controls anger." - Prophet Muhammad (SAW)  
━━━━━━━━━━━━━━━━━━━━━━
`;

      const helpImage = "https://bit.ly/40TIaTY";

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "${commandName}" not found.`);
      } else {
        const config = command.config;
        const roleText = roleTextToString(config.role);
        const guide = config.guide?.en?.replace(/{pn}/g, prefix) || "No guide available.";

        const details = `
╔═════════════════╗
║  🔍 *COMMAND DETAILS*  ║
╚═════════════════╝

📌 *Command:* ${config.name}  
📜 *Description:* ${config.longDescription?.en || "No description"}  
📂 *Category:* ${config.category || "Uncategorized"}  
👑 *Author:* ${config.author || "Unknown"}  
⚙ *Usage:* ${guide}  
🛠 *Version:* ${config.version || "1.0"}  
🎭 *Role:* ${roleText}  
━━━━━━━━━━━━━━━━━━━━━━
`;

        await message.reply(details);
      }
    }
  },
};

function roleTextToString(role) {
  const roles = {
    0: "All users",
    1: "Group admins",
    2: "Bot admins",
  };
  return roles[role] || "Unknown role";
}
