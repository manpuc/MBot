const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: { name: "cat", description: "ねこを感じられます" },
  async execute(interaction) {
    try {
      if (!interaction.deferred) await interaction.deferReply();
      const response = await axios.get("https://api.thecatapi.com/v1/images/search", {
        headers: { "x-api-key": process.env.THECATAPI_KEY },
      });

      if (!response.data || response.data.length === 0) return interaction.editReply("猫画像が見つかりませんでした。");

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("Random Cat")
        .setImage(response.data[0].url);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("コマンド実行中にエラーが発生しました。");
      } else {
        await interaction.reply({ content: "コマンド実行中にエラーが発生しました。", ephemeral: true });
      }
    }
  },
};
