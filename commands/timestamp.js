const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "timestamp", description: "現在時刻のUNIXタイムスタンプを返します" },
  async execute(interaction) {
    try {
      const now = Date.now();
      const sec = Math.floor(now / 1000);

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("⏱ 現在時刻")
        .setDescription(`UNIXミリ秒: \`${now}\`\nUNIX秒: \`${sec}\`\nDiscord形式: <t:${sec}:F>`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
