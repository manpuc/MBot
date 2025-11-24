module.exports = {
  data: {
    name: "send-txt",
    description: "テキストを使用されたテキストチャンネルに送信します。",
    options: [
      { name: "text", description: "送信するテキスト", type: 3, required: true },
    ],
  },
  async execute(interaction) {
    const text = interaction.options.getString("text");

    try {
      await interaction.channel.send({ content: text });
      // 送信完了メッセージは不要
      await interaction.deferReply({ ephemeral: true });
      await interaction.deleteReply(); // インタラクションを完了させるだけ
    } catch (err) {
      await interaction.reply({ content: `送信中にエラーが発生しました: ${err.message}`, ephemeral: true });
    }
  },
};
