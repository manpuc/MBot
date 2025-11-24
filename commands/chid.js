const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "chid", description: "現在のDiscordチャンネルIDを取得します" },
  async execute(interaction) {
    const channelID = interaction.channelId;
    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("チャンネルIDの取得")
      .setDescription(`このチャンネルのIDは \`${channelID}\` です。`);
    await interaction.reply({ embeds: [embed] });
  },
};
