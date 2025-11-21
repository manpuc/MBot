const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "timestamp",
    description: "現在時刻のUNIXタイムスタンプを返します",
  },
  async execute(interaction) {
    try {
      const now = Date.now(); // ミリ秒
      const unixSec = Math.floor(now / 1000); // 秒

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle("⏱ 現在時刻")
        .setDescription(`UNIXミリ秒: \`${now}\`\nUNIX秒: \`${unixSec}\`\nDiscord形式: <t:${unixSec}:F>`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー")
        .setDescription(`タイムスタンプ取得中にエラーが発生しました。\n\`${error.message}\``);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
