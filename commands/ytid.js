const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "ytid",
    description: "YouTube URLからチャンネルIDを取得します",
    options: [
      {
        name: "url",
        type: 3,
        description: "YouTube URL（例: https://www.youtube.com/watch?v=XXXXXXXXXXX）",
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const url = interaction.options.getString("url");

    // YouTube URLのチェック
    const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("有効な YouTube URL を入力してください。\n例: https://www.youtube.com/watch?v=XXXXXXXXXXX");

      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    try {
      // ---- HTML取得（axios） ----
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "ja-JP",
        }
      });

      const html = response.data;

      // ---- JSON抽出（ytInitialData / ytInitialPlayerResponse）----
      let jsonStr = null;

      const regex1 = /var ytInitialPlayerResponse = ({.*?});/s;
      const regex2 = /var ytInitialData = ({.*?});/s;

      const found =
        html.match(regex1) ||
        html.match(regex2);

      if (!found) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("抽出失敗")
          .setDescription("YouTubeページ解析に失敗しました。YouTube側の仕様変更の可能性があります。");

        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      jsonStr = found[1];

      let data;
      try {
        data = JSON.parse(jsonStr);
      } catch (e) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("JSONエラー")
          .setDescription("YouTubeの埋め込みデータをパースできませんでした。");

        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      // ---- チャンネルID 抽出 ----
      let channelId = null;

      if (data?.videoDetails?.channelId) {
        channelId = data.videoDetails.channelId;
      } else if (data?.metadata?.channelMetadataRenderer?.externalId) {
        channelId = data.metadata.channelMetadataRenderer.externalId;
      }

      if (!channelId) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("取得不可")
          .setDescription("チャンネルIDを取得できませんでした。");

        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      // ---- 成功表示 ----
      const embed = new MessageEmbed()
        .setTitle("📺 チャンネルID取得")
        .addField("URL", url)
        .addField("チャンネルID", `\`${channelId}\``)
        .setColor("E841C4");

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);

      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("通信エラー")
        .setDescription("YouTubeページの取得中にエラーが発生しました。");

      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
