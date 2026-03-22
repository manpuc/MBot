const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const apiKey = process.env.YOUTUBE_API_KEY;

module.exports = {
  data: {
    name: "send-img",
    description:
      "指定された画像またはYouTubeの動画URLをテキストチャンネルに送信します。",
    options: [
      {
        name: "url",
        description: "送信する画像またはYouTubeの動画URLを入力してください。",
        type: 3, // type 3 は文字列
        required: true,
      },
      {
        name: "anon",
        description: "匿名で送信するかどうかを選択してください。",
        type: 5, // type 5 は真偽値
        required: true,
      },
      {
        name: "ex",
        description: "説明を入力してください。",
        type: 3, // type 3 は文字列
        required: false,
      },
      {
        name: "spoiler",
        description:
          "送信する画像または動画にスポイラーをかけるかどうかを選択してください。",
        type: 5, // type 5 は真偽値
        required: false,
      },
    ],
  },
  async execute(interaction) {
    function extractVideoIdFromUrl(url) {
      const regExp =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }

    async function getYouTubeVideoInfo(videoUrl) {
      try {
        const videoId = extractVideoIdFromUrl(videoUrl);
        if (!videoId) {
          return null;
        }

        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
        const response = await axios.get(apiUrl);
        const videoInfo = response.data;

        if (
          videoInfo &&
          videoInfo.items &&
          videoInfo.items.length > 0 &&
          videoInfo.items[0].snippet
        ) {
          return {
            channelTitle: videoInfo.items[0].snippet.channelTitle,
            videoTitle: videoInfo.items[0].snippet.title,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnailUrl: videoInfo.items[0].snippet.thumbnails.default.url,
            isYouTubeVideo: true,
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching YouTube video info:", error);
        return null;
      }
    }

    const imageUrl = interaction.options.getString("url");
    const isAnonymous = interaction.options.getBoolean("anon");
    const description = interaction.options.getString("ex");
    const spoiler = interaction.options.getBoolean("spoiler");

    // サムネイルの取得または動画の情報を取得
    const videoInfo = await getYouTubeVideoInfo(imageUrl);

    const embed = new MessageEmbed().setColor("E841C4");

    if (videoInfo && videoInfo.isYouTubeVideo) {
      // サムネイルをEmbedに追加
      embed.setImage(videoInfo.thumbnailUrl);

      // 投稿者のチャンネルをタイトルに追加
      embed.setTitle(videoInfo.channelTitle);

      // 動画のタイトルをフィールドに追加
      embed.addField("動画のタイトル", videoInfo.videoTitle);

      // 動画のURLをEmbedに追加
      embed.addField("動画を再生する", `[動画リンク](${videoInfo.videoUrl})`);

      // サムネイルがある場合は埋め込み外に送信
      await interaction.reply({ embeds: [embed] });
    } else {
      // サムネイルが取得できない場合は、通常の画像URLをセット
      embed.setImage(imageUrl);

      // サムネイルがない場合は埋め込み内に送信
      const channel = interaction.channel;
      try {
        await channel.send({ embeds: [embed] });
      } catch (error) {
        console.error(`Failed to send image or video: ${error}`);
        const errorEmbed = new MessageEmbed()
          .setColor("E841C4")
          .setDescription("画像または動画の送信に失敗しました。");
        await interaction.reply({ embeds: [errorEmbed] });
      }
    }
  },
};
