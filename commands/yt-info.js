const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

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

    if (videoId) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&id&key=${process.env.YOUTUBE_API_KEY}`;

      try {
        const fetch = await import("node-fetch"); // ダイナミックインポート
        const response = await fetch.default(apiUrl); // .defaultを使用してfetchモジュールを取得
        const data = await response.json();

        if (data.items.length > 0) {
          const videoInfo = data.items[0];
          const snippet = videoInfo.snippet;
          const contentDetails = videoInfo.contentDetails;
          const videoId = videoInfo.id;
          const streamingDetails = videoInfo.streamingDetails;

          const duration = parseDuration(contentDetails.duration);

          const embed = new MessageEmbed()
            .setColor("E841C4")
            .setTitle(snippet.title)
            .addField("チャンネル", snippet.channelTitle)
            .addField("公開日", new Date(snippet.publishedAt).toDateString())
            .addField("動画の長さ", duration)
            .addField("ID", videoId)
            .setDescription(snippet.description)
            .setThumbnail(snippet.thumbnails.maxres.url);

          await interaction.reply({ embeds: [embed], ephemeral: false });
        } else {
          await interaction.reply("動画が見つかりませんでした。");
        }
      } catch (error) {
        console.error(error);
        await interaction.reply("動画情報の取得中にエラーが発生しました。");
      }
    } else {
      await interaction.reply("無効なYouTube URLです。正しいURLを使用してください。");
    }
  },
};

// YouTube URLからビデオIDを抽出する関数
function getVideoIdFromURL(url) {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/channel\/|youtube\.com\/user\/)([^?&/]+)/
  );
  if (videoIdMatch) {
    return videoIdMatch[1];
  }
  return null;
}

// ISO 8601形式の時間を解析してHH:MM:SS形式に変換する関数
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return `${hours}時間${minutes}分${seconds}秒`;
}

// 入力URLを正規化する関数
function normalizeURL(url) {
  // youtube.com/watch?v=VIDEO_ID 形式に正規化
  if (url.match(/youtube\.com\/watch\?v=/)) {
    return url;
  }
  // youtu.be/VIDEO_ID 形式に正規化
// youtu.be/VIDEO_ID 形式に正規化
  if (url.match(/youtu\.be\/([^?&/]+)/)) {
    const videoIdMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
    }
  }
  return url; // それ以外の場合はそのまま返す
}
