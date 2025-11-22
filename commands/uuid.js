const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { v4: uuidv4 } = require("uuid"); // uuid ライブラリをインポート

module.exports = {
  data: {
    name: "uuid",
    description: "UUIDを生成して送信します",
  },
  async execute(interaction) {
    // UUIDを生成
    const uuid = uuidv4();

    // 生成されたUUIDを埋め込みメッセージで表示
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("UUID!!!!")
      .setDescription(`${uuid}`);

    // ボタンを含むメッセージを返信
    await interaction.reply({
      content: "UUIDを生成しました:",
      embeds: [embed],
      ephemeral: true,
    });
  },
};
