const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: { name: "icon", description: "コマンド使用者のアイコンを表示します" },
  async execute(interaction) {
    const imageUrl = interaction.user.displayAvatarURL({ dynamic: true, format: "png" });

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle(`${interaction.user.username}'s Icon`)
      .setImage(imageUrl);

    const row = new ActionRowBuilder()
      .addComponents(new ButtonBuilder().setURL(imageUrl).setLabel("Download").setStyle(ButtonStyle.Link));

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
