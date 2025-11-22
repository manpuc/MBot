const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: {
    name: "ban-list",
    description: "Banされたメンバーのリストを表示します",
  },
  async execute(interaction) {
    const member = interaction.member;

    // ユーザーに'BAN_MEMBERS'権限があるか確認
    if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
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

      const banList = bannedMembers.map((ban) => {
        const { user, reason } = ban;
        const username = user.tag.replace(/#0$/, ''); // ユーザー名から'#0'を削除
        return `**ユーザー:** ${username}\n**理由:** ${reason || "なし"}\n------------------`;
      });

      const embed = new MessageEmbed()
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
