const { MessageEmbed, CommandInteractionOptionResolver } = require('discord.js');
const whois = require('whois-json');

module.exports = {
  data: {
    name: 'registered-domain-check',
    description: '指定されたドメインが使用中かどうかを確認します。',
    options: [
      {
        name: 'domain',
        description: '確認するドメイン名',
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const domain = interaction.options.getString('domain');

    try {
      const domainInfo = await whois(domain);

      if (domainInfo.status === 'available') {
        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle('ドメインの状態')
          .setDescription(`ドメイン "${domain}" は使用可能です。`);
        await interaction.reply({ embeds: [embed] , ephemeral: true});
      } else {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle('ドメインの状態')
          .setDescription(`ドメイン "${domain}" は使用中です。`);
        await interaction.reply({ embeds: [embed] , ephemeral: true});
        
      }
    } catch (error) {
      console.error(error);
      const embed = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('エラー')
        .setDescription('ドメイン情報を取得できませんでした。');
      await interaction.reply({ embeds: [embed] , ephemeral: true});
    }
  },
};