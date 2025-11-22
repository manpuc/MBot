const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "rolecount",
    description: "サーバー内のロールごとの人数を集計します",
  },
  async execute(interaction) {
    try {
      const roles = interaction.guild.roles.cache
        .filter(r => r.name !== "@everyone")
        .map(r => ({ name: r.name, count: r.members.size }))
        .sort((a, b) => b.count - a.count); // 人数が多い順

      if (roles.length === 0) {
        return interaction.reply({ content: "ロールが存在しません。", ephemeral: true });
      }

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle("📊 ロール別人数集計")
        .setDescription(
          roles.map(r => `**${r.name}**: ${r.count} 人`).join("\n")
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー")
        .setDescription(`集計中にエラーが発生しました。\n\`${error.message}\``);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
