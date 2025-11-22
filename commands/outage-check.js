const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "outage-check",
    description: "指定されたURLのサーバーの応答を確認します",
    options: [
      {
        name: "url",
        description: "チェックするサーバーのURL",
        type: 3,
        required: true,
      },
    ],
  },

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let url = interaction.options.getString("url");

    // http / https 自動補完
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }

    try {
      const response = await axios.get(url, { timeout: 5000 });

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle("🖥️ サーバーステータス")
        .addField("URL", url)
        .addField("ステータス", `🟢 **オンライン (${response.status})**`)
        .setFooter({ text: "応答を正常に取得しました" });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🖥️ サーバーステータス")
        .addField("URL", url)
        .addField("結果", "🔴 **オフライン または 応答なし**")
        .addField("エラー内容", `\`${error.message}\``)
        .setFooter({ text: "5秒以内に応答がない場合オフラインと判定します" });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
