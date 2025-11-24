const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "first-word", description: "チャンネルで最初に送られたメッセージのURLを取得" },
  async execute(interaction) {
    // サーバー内か確認
    if (!interaction.guild) {
      return interaction.reply({ content: "サーバー内のテキストチャンネルで使用してください。", ephemeral: true });
    }

    const channel = interaction.channel;
    if (!channel.isTextBased()) {
      return interaction.reply({ content: "テキストチャンネルで使用してください。", ephemeral: true });
    }

    try {
      const messages = await channel.messages.fetch({ limit: 1, after: 0 });
      const firstMessage = messages.first();

      if (!firstMessage) {
        return interaction.reply({ content: "メッセージがまだ送信されていません。", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("最初のメッセージ")
        .setDescription(`[こちらから確認](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${firstMessage.id})`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: `エラーが発生しました: ${err.message}`, ephemeral: true });
    }
  },
};
