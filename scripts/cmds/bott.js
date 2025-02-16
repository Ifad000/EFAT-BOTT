const fs = require("fs-extra");

const teachFile = "teachData.json";

// যদি ফাইল না থাকে, তাহলে তৈরি করবে
if (!fs.existsSync(teachFile)) {
  fs.writeFileSync(teachFile, JSON.stringify({}));
}

// ফাংশন: বিশেষ অক্ষর ও ইমোজি সরানো
function removeSpecialChars(text) {
  return text
    .replace(/[^\w\s]/g, '') // স্পেশাল ক্যারেক্টার রিমুভ (শুধু অক্ষর এবং স্পেস রাখবে)
    .replace(/[^\x00-\x7F]/g, '') // নন-ASCII (ইমোজি ও প্রতীক) রিমুভ
    .trim(); // বাড়তি স্পেস সরানো
}

module.exports = {
  config: {
    name: "teach",
    version: "1.0",
    author: "Efat",
    countDown: 5,
    role: 1, // শুধু এডমিন ইউজ করতে পারবে
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

    // থ্রেডের এডমিন তথ্য বের করা
    const threadInfo = await api.getThreadInfo(threadID);
    
    // যদি ইউজার এডমিন না হয়, তাহলে অনুমতি দেবে না
    if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) {
      return message.reply("❌ শুধুমাত্র এডমিনরা বটকে শেখাতে পারবে!");
    }

    // ইনপুট চেক করা (সঠিক ফরম্যাট কি না)
    if (args.length < 3 || !args.includes("|")) {
      return message.reply("⚠️ **সঠিক ফরম্যাট:** `{pn} Hello | Hi`");
    }

    const input = args.join(" ").split("|").map(item => item.trim());
    const trigger = removeSpecialChars(input[0].toLowerCase()); // ক্লিন করা ট্রিগার
    const response = input[1]; // রেসপন্স অপরিবর্তিত থাকবে

    let teachData = JSON.parse(fs.readFileSync(teachFile, "utf8"));
    teachData[trigger] = response;

    fs.writeFileSync(teachFile, JSON.stringify(teachData, null, 2));

    message.reply(`✅ **"${trigger}"** শেখানো হয়েছে! এখন কেউ "${trigger}" বললে বট উত্তর দেবে: *"${response}"*`);
  },

  onChat: async function ({ message, event }) {
    const { body } = event;
    if (!body) return;

    let teachData = JSON.parse(fs.readFileSync(teachFile, "utf8"));
    const lowerBody = removeSpecialChars(body.toLowerCase()); // ইউজারের ইনপুট ক্লিন করা

    // যদি শেখানো ম্যাসেজের সাথে মিলে, তাহলে রিপ্লাই দেবে
    if (teachData.hasOwnProperty(lowerBody)) {
        return message.reply(teachData[lowerBody]);
    }
  }
};
