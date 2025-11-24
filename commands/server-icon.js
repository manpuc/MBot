const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "server-icon", description: "サーバーのアイコン画像をダウンロードします" },
  async execute(interaction) {
    if (!interaction.inGuild()) {
      const errEmbed = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("サーバー内でのみ使用できます。");
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    const guild = interaction.guild;
    const iconURL = guild.iconURL({ format: "png", dynamic: true, size: 1024 });

    if (!iconURL) {
      const errEmbed = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("サーバーアイコンが見つかりません。\nサーバーアイコンが設定されているか確認してください。");
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("アイコンをダウンロード").setStyle(ButtonStyle.Link).setURL(iconURL)
    );

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle(`${guild.name} のサーバーアイコン`)
      .setImage(iconURL);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
