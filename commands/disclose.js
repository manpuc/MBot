const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "disclose",
    description: "コマンドの使用者に関する情報をまとめて送信します。",
    options: [
      {
        name: "ephemeral",
        description: "他のユーザーに表示するかどうか",
        type: 5, // BOOLEAN
        required: true,
      },
    ],
  },
  async execute(interaction) {
    try {
      // サーバー内でのみ使用可能
      if (!interaction.inGuild()) {
        await interaction.reply({ content: "このコマンドはサーバー内で使用してください。", ephemeral: true });
        return;
      }

      const isEphemeral = interaction.options.getBoolean("ephemeral");
      const user = interaction.user;
      const member = await interaction.guild.members.fetch(user.id);

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("ユーザー情報")
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "サーバー名", value: interaction.guild.name },
          { name: "ユーザーID", value: user.id },
          { name: "ユーザータグ", value: user.tag.replace(/#0$/, '') },
          { name: "サーバーに入った日時", value: member.joinedAt?.toLocaleString() || "取得不可" },
          { name: "ニックネーム", value: member.nickname || "なし" },
          { name: "権限", value: member.permissions.toArray().join(", ") },
          { name: "ロール", value: member.roles.cache.filter(r => r.name !== "@everyone").map(r => r.name).join(", ") },
        );

      await interaction.reply({ embeds: [embed], ephemeral: isEphemeral });

    } catch (error) {
      console.error("discloseコマンドエラー:", error);
      await interaction.reply({ content: "エラーが発生しました。", ephemeral: true });
    }
  },
};
