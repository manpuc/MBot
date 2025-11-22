const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "yt-info",
    description: "YouTube動画の詳細情報を取得します",
    options: [
      {
        name: "url",
        description: "YouTube動画のURL",
        type: 3,
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const youtubeURL = interaction.options.getString("url");
    const normalizedURL = normalizeURL(youtubeURL);
    const videoId = getVideoIdFromURL(normalizedURL);

    if (!videoId) {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー")
        .setDescription("無効なYouTube URLです。正しいURLを使用してください。");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.YOUTUBE_API_KEY}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.items || data.items.length === 0) {
        const embed = new MessageEmbed()
          .setColor("#FF0000")
          .setTitle("動画が見つかりません")
          .setDescription("指定された動画IDの情報を取得できませんでした。");
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const videoInfo = data.items[0];
      const snippet = videoInfo.snippet;
      const contentDetails = videoInfo.contentDetails;

      const duration = parseDuration(contentDetails.duration);
      const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || null;

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle(snippet.title)
        .addField("チャンネル", snippet.channelTitle, true)
        .addField("公開日", new Date(snippet.publishedAt).toDateString(), true)
        .addField("動画の長さ", duration, true)
        .addField("動画ID", videoId, true)
        .setDescription(snippet.description || "説明なし");

      if (thumbnail) embed.setThumbnail(thumbnail);

      await interaction.reply({ embeds: [embed], ephemeral: false });

    } catch (error) {
      console.error(error);
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー")
        .setDescription(`動画情報の取得中にエラーが発生しました。\n\`${error.message}\``);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

// ----------------------------
// ユーティリティ関数
// ----------------------------

// YouTube URLからビデオIDを抽出
function getVideoIdFromURL(url) {
  const match = url.match(
    /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ISO 8601形式の時間をHH:MM:SSに変換
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || 0, 10);
  const minutes = parseInt(match?.[2] || 0, 10);
  const seconds = parseInt(match?.[3] || 0, 10);
  return `${hours}時間${minutes}分${seconds}秒`;
}

// 入力URLを正規化
function normalizeURL(url) {
  if (url.match(/youtube\.com\/watch\?v=/)) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/watch?v=${shortMatch[1]}`;
  return url;
}