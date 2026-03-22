const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "rolecount",
    description: "サーバー内のロールごとの人数を集計します",
  },
  async execute(interaction) {
    // サーバー内でのみ使用可能
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "このコマンドはサーバー内で使用してください。", ephemeral: true });
      return;
    }

    const roles = interaction.guild.roles.cache
      .filter(r => r.name !== "@everyone")
      .map(r => ({ name: r.name, count: r.members.size }))
      .sort((a, b) => b.count - a.count);

    if (!roles.length) {
      await interaction.reply({ content: "ロールが存在しません。", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("📊 ロール別人数集計")
      .setDescription(roles.map(r => `**${r.name}**: ${r.count} 人`).join("\n"));

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
