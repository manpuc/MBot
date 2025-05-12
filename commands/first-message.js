const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "first-message",
    description: "テキストチャンネルで最初に送られたメッセージのURLを取得します",
  },
  async execute(interaction) {
    const { channel } = interaction;

    if (channel.isText()) {
      // テキストチャンネルのメッセージを取得
      const messages = await channel.messages.fetch({ limit: 1, after: 0 });
      const firstMessage = messages.first();

      if (firstMessage) {
        // メッセージのリンクを生成
        const messageLink = `https://discord.com/channels/${interaction.guild.id}/${channel.id}/${firstMessage.id}`;

        const embed = new MessageEmbed()
          .setColor("E841C4")
          .setTitle("Server First Message")
          .setDescription(`最初のメッセージのURL: [メッセージへのリンク](${messageLink})`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply("このサーバーでまだメッセージが送信されていません。");
      }
    } else {
      await interaction.reply("このコマンドはテキストチャンネルでのみ使用できます。");
    }
  },
};
