const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: { name: "ytid", description: "YouTubeチャンネルURLから情報取得", options: [{ name: "url", type: 3, description: "チャンネルURL", required: true }] },
  async execute(interaction) {
    try {
      const url = interaction.options.getString("url");
      if (!url.includes("youtube.com")) return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("有効なURLを入力してください")], ephemeral: true });

      const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ja-JP" } });
      const html = res.data;
      const m = html.match(/var ytInitialData = ({.*?});<\/script>/s);
      if (!m) return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("データ解析失敗")], ephemeral: true });

      const data = JSON.parse(m[1]);
      const meta = data.metadata?.channelMetadataRenderer;
      if (!meta) return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("チャンネル情報取得失敗")], ephemeral: true });

      const embed = new EmbedBuilder().setColor("E841C4").setTitle("チャンネル情報").addFields({ name: "入力URL", value: url }, { name: "チャンネルURL", value: `https://www.youtube.com/channel/${meta.externalId}` });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`通信エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
