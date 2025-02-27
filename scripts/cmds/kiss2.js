const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "kiss2",
    aliases: ["kiss2"],
    version: "1.0",
    author: "NIB",
    countDown: 5,
    role: 0,
    shortDescription: "KISS2",
    longDescription: "Generate a kiss image with two users' avatars on a custom kiss background image.",
    category: "funny",
    guide: "{pn} @user"
  },

  onStart: async function ({ api, message, event, args, usersData }) {
    let one, two;
    const mention = Object.keys(event.mentions);

    // Ensure at least two users are mentioned
    if (mention.length === 0) {
      return message.reply("Please mention someone.");
    } else if (mention.length === 1) {
      one = event.senderID;
      two = mention[0];
    } else {
      one = mention[1];
      two = mention[0];
    }

    // Get the avatar URLs for both users
    const avatarURL1 = await usersData.getAvatarUrl(one);
    const avatarURL2 = await usersData.getAvatarUrl(two);

    try {
      // Custom kiss background image URL
      const kissBackgroundURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQla2YkrSHTsBBBf9HPe2qvyr1g93ndYe7g58P2rOyAub2yp87TlErI6Olj&s=10";
      
      // Fetch the images
      const avatar1 = await axios.get(avatarURL1, { responseType: 'arraybuffer' });
      const avatar2 = await axios.get(avatarURL2, { responseType: 'arraybuffer' });
      const kissBackground = await axios.get(kissBackgroundURL, { responseType: 'arraybuffer' });

      // Load images onto canvas
      const canvas = require("canvas");
      const c = canvas.createCanvas(500, 500);  // Set canvas size
      const ctx = c.getContext("2d");

      // Load all images
      const userImg1 = await canvas.loadImage(avatar1.data);
      const userImg2 = await canvas.loadImage(avatar2.data);
      const kissImg = await canvas.loadImage(kissBackground.data);

      // Draw kiss background image
      ctx.drawImage(kissImg, 0, 0, c.width, c.height);

      // Overlay user images (flip positions)
      ctx.drawImage(userImg1, 300, 100, 100, 100);  // User 1 (right)
      ctx.drawImage(userImg2, 100, 100, 100, 100);  // User 2 (left)

      // Save the combined image
      const pathSave = `${__dirname}/tmp/${one}_${two}_kiss2.png`;
      const output = fs.createWriteStream(pathSave);
      const stream = c.createPNGStream();
      stream.pipe(output);

      output.on("finish", () => {
        // Send the kiss image
        message.reply({
          body: "😘😘 Here's a kiss image with the bot and user!",
          attachment: fs.createReadStream(pathSave),
        }, () => fs.unlinkSync(pathSave));  // Clean up after sending
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ An error occurred while generating the kiss2 image.");
    }
  }
};
