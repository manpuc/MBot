const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'server-icon',
    description: 'サーバーのアイコン画像をダウンロードします',
  },
  async execute(interaction) {
    // Check if the interaction is in a guild (server)
    if (!interaction.inGuild()) {
      return interaction.reply('このコマンドはサーバー内でのみ利用できます。');
    }

    const server = interaction.guild;
    const serverIconURL = server.iconURL({ format: 'png', dynamic: true, size: 1024 });

    if (!serverIconURL) {
      return interaction.reply('このサーバーのアイコンが見つかりませんでした。');
    }

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle('LINK')
          .setLabel('アイコンをダウンロード')
          .setURL(serverIconURL)
      );

    const embed = new MessageEmbed()
      .setColor('#E841C4')
      .setTitle(`サーバーアイコン - ${server.name}`)
      .setImage(serverIconURL);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
