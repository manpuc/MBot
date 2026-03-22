const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "dog",
    description: "いぬを感じられます",
  },
  async execute(interaction) {
    try {
      // 応答を保留（処理中表示）
      if (!interaction.deferred) await interaction.deferReply();

      // ランダム犬画像を取得
      const response = await axios.get("https://dog.ceo/api/breeds/image/random");
      const imageUrl = response.data.message;

      // Embed 作成
      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("Random Dog")
        .setImage(imageUrl);

      // deferしている場合は editReply で返信
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("Dog API error:", error);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("コマンド実行中にエラーが発生しました。");
      } else {
        await interaction.reply({ content: "コマンド実行中にエラーが発生しました。", ephemeral: true });
      }
    }
  },
};
