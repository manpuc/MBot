const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "server-info",
    description: "サーバーに関する情報を表示します",
  },
  async execute(interaction) {
    const guild = interaction.guild;

    if (!guild) {
      return await interaction.reply("このコマンドはサーバー内でのみ使用できます。");
    }

    const embed = new MessageEmbed()
      .setColor("#E841C4")
      .setTitle("サーバー情報")
      .setThumbnail(guild.iconURL()) // サーバーアイコンを埋め込みに追加
      .addFields(
        { name: "サーバー名", value: guild.name || "N/A", inline: true },
        { name: "サーバーID", value: guild.id || "N/A", inline: true },
        //{ name: "メンバー数", value: guild.memberCount || "N/A", inline: true },
        { name: "作成日", value: guild.createdAt ? guild.createdAt.toISOString() : "N/A", inline: true },
        { name: "テキストチャンネル数", value: (guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size || 0).toString(), inline: true },
        { name: "ボイスチャンネル数", value: (guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size || 0).toString(), inline: true },
        { name: "カテゴリー数", value: (guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size || 0).toString(), inline: true },
        { name: "絵文字数", value: guild.emojis.cache.size.toString() || "N/A", inline: true },
        //{ name: "サーバースタンプ数", value: guild.splash ? guild.splash : "N/A", inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
