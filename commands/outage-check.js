const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "outage-check",
    description: "指定されたURLのサーバーの応答を確認します",
    options: [
      {
        name: "url",
        description: "チェックするサーバーのURL",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let url = interaction.options.getString("url");
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    try {
      const response = await axios.get(url, { timeout: 5000 });
      const embed = new EmbedBuilder()
        .setColor("#E841C4")
        .setTitle("🖥️ サーバーステータス")
        .addFields(
          { name: "URL", value: url },
          { name: "ステータス", value: `🟢 **オンライン (${response.status})**` }
        )
        .setFooter({ text: "応答を正常に取得しました" });
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("🖥️ サーバーステータス")
        .addFields(
          { name: "URL", value: url },
          { name: "結果", value: "🔴 **オフライン または 応答なし**" },
          { name: "エラー内容", value: `\`${error.message}\`` }
        )
        .setFooter({ text: "5秒以内に応答がない場合オフラインと判定します" });
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
