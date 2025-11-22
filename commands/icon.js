const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "icon",
    description: "コマンド使用者のアイコンを表示します",
  },
  async execute(interaction) {
    // コマンド使用者のアイコン画像のURLを取得
    const imageUrl = interaction.user.displayAvatarURL({ dynamic: true, format: "png" });

    // メッセージにエンベッドとボタンを追加
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle(`${interaction.user.username}'s Icon`)
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
