const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "hello",
    description: "あいさつを返す",
  },
  async execute(interaction) {
    const replyMessage = `${interaction.user}, ごきげんよう`;
    await interaction.reply(replyMessage);
  },
};
