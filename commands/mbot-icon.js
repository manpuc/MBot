const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "mbot-icon",
    description: "MBotのアイコンを表示します",
  },
  async execute(interaction) {
    // 画像のURLを指定
    const imageUrl = "https://raw.githubusercontent.com/manpuc/MBot-Image/main/MbotIcon2_.png";

    // メッセージにエンベッドとボタンを追加
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("MBot Icon")
      .setImage(imageUrl);
    
    const downloadButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL(imageUrl)
          .setLabel("Download")
          .setStyle("LINK")
      );

    // メッセージにエンベッドとボタンを追加して送信
    await interaction.reply({
      embeds: [embed],
      components: [downloadButton],
      ephemeral: true,
    });
  },
};
