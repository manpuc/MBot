const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: {
    name: "new-nick",
    description: "サーバーニックネームを変更します",
    options: [
      {
        name: "newnick",
        description: "新しいニックネーム",
        type: 3, // STRINGのtypeを指定
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const newNickname = interaction.options.getString("newnick");

    if (!newNickname) {
      const embed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("新しいニックネームが指定されていません。");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await interaction.member.setNickname(newNickname);
      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("ニックネーム変更")
        .setDescription(
          `サーバーニックネームが"${newNickname}"に変更されました。`
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      const errorMessage = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("ニックネームを変更できませんでした。以下の事を確認してください。")
        .addField("1. Botの権限", "Botの権限が使用者より上にある必要があります。")
        .addField("2. ニックネームの管理", "Botにニックネームの管理権限が必要です。")
        .addField("3. サーバーの制限", "サーバーのニックネーム変更制限を確認してください。");
      
      interaction.reply({ embeds: [errorMessage], ephemeral: true });
    }
  },
};
