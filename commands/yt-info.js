const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: { name: "yt-info", description: "YouTube動画詳細を取得", options: [{ name: "url", type: 3, description: "動画URL", required: true }] },
  async execute(interaction) {
    try {
      const url = interaction.options.getString("url");
      const videoId = getVideoId(url);
      if (!videoId) return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("無効なYouTube URLです")], ephemeral: true });

      const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.YOUTUBE_API_KEY}`);
      const video = res.data.items?.[0];
      if (!video) return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("動画が見つかりません")], ephemeral: true });

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle(video.snippet.title)
        .addFields(
          { name: "チャンネル", value: video.snippet.channelTitle, inline: true },
          { name: "公開日", value: new Date(video.snippet.publishedAt).toDateString(), inline: true },
          { name: "動画ID", value: videoId, inline: true },
          { name: "動画の長さ", value: parseDuration(video.contentDetails.duration), inline: true }
        )
        .setDescription(video.snippet.description || "")
        .setThumbnail(video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || null);

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};

function getVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
function parseDuration(d) {
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return `${m?.[1]||0}時間${m?.[2]||0}分${m?.[3]||0}秒`;
}
