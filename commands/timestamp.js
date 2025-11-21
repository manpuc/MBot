const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "timestamp",
    description: "現在時刻のタイムスタンプを返します",
  },

  async execute(interaction) {
    try {
      const now = Math.floor(Date.now() / 1000);

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("⏱ タイムスタンプ")
        .setDescription(
          `**UNIX時間：** \`${now}\`\n` +
          `**Discord表記：** <t:${now}:F>（<t:${now}:R>）`
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー発生")
        .setDescription("タイムスタンプ生成中にエラーが発生しました。");

      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
