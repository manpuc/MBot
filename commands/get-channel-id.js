const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "get-channel-id",
    description: "チャンネルのIDを取得します",
  },
  async execute(interaction) {
    const channelID = interaction.channelId;

    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("チャンネルIDの取得")
      .setDescription(`このチャンネルのIDは \`${channelID}\` です。`);

    await interaction.reply({ embeds: [embed] });
  },
};
