const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('IDを取得')　
    .setType(ApplicationCommandType.Message),
  async execute(i) {
    const e = new EmbedBuilder()
      .setColor(process.env.C)
      .setTitle(`${("` " +　i.targetMessage.cleanContent.substr( 0, 1000 )+ "`")}`)
      .setAuthor({
        name: i.targetMessage.author.tag,
        iconURL: i.targetMessage.author.displayAvatarURL({
          format: 'png'
        })
      })
      .addFields({
        name: 'メッセージID',
        value: "```javascript\n" + i.targetMessage.id + "\n```",
        inline: false
      }, {
        name: 'サーバーID',
        value: "```javascript\n" + i.targetMessage.guild.id + "\n```",
        inline: false
      }, {
        name: 'チャンネルID',
        value: "```javascript\n" + i.targetMessage.channel.id + "\n```",
        inline: false
      }, {
        name: 'ユーザーID',
        value: "```javascript\n" + i.targetMessage.author.id + "\n```",
        inline: false
      }, )


    await i.reply({
      embeds: [e],
      ephemeral: true
    });
  },
}
//i.targetMessage.author.displayAvatarURL({ format: 'png' })