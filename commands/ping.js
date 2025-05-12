const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "ping",
    description: "現在のpingを測定します",
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("Ping")
      .setDescription(
        `🏓 Pong! ${Date.now() - interaction.createdTimestamp}ms`
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
