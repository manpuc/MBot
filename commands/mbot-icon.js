const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "mbot-icon",
    description: "MBotのアイコンを表示します",
  },
  async execute(interaction) {
    const imageUrl = "https://raw.githubusercontent.com/manpuc/MBot-Image/main/MbotIcon2_.png";

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("MBot Icon")
      .setImage(imageUrl);

    const downloadButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(imageUrl)
        .setLabel("Download")
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({ embeds: [embed], components: [downloadButton], ephemeral: true });
  },
};
