const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: {
    name: "ban-list",
    description: "Banされたメンバーのリストを表示します",
  },
  async execute(interaction) {
    // サーバー内でのみ使用可能
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "このコマンドはサーバー内で使用してください。", ephemeral: true });
      return;
    }

    const member = interaction.member;

    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: "必要な権限がありません。", ephemeral: true });
      return;
    }

    const guild = interaction.guild;

    try {
      const bannedMembers = await guild.bans.fetch();
      if (bannedMembers.size === 0) {
        await interaction.reply({ content: "Banされたメンバーはいません。", ephemeral: true });
        return;
      }

      const banList = bannedMembers.map(ban => {
        const username = ban.user.tag.replace(/#0$/, '');
        return `**ユーザー:** ${username}\n**理由:** ${ban.reason || "なし"}\n------------------`;
      });

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("Banリスト")
        .setDescription(banList.join("\n"));

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Banリストを取得できませんでした。", ephemeral: true });
    }
  },
};
