const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: { name: "server-info", description: "サーバーに関する情報を表示します" },
  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: "サーバー内でのみ使用可能です。", ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("サーバー情報")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "サーバー名", value: guild.name, inline: true },
        { name: "サーバーID", value: guild.id, inline: true },
        { name: "作成日", value: guild.createdAt.toISOString(), inline: true },
        { name: "テキストチャンネル数", value: guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size.toString(), inline: true },
        { name: "ボイスチャンネル数", value: guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size.toString(), inline: true },
        { name: "カテゴリー数", value: guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size.toString(), inline: true },
        { name: "絵文字数", value: guild.emojis.cache.size.toString(), inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
