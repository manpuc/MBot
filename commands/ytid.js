const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "ytid",
    description: "YouTube チャンネルURLからチャンネルIDと情報を取得します",
    options: [
      {
        name: "url",
        type: 3,
        description: "YouTube チャンネルURL（https://www.youtube.com/@xxxx）",
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const url = interaction.options.getString("url");

    // @形式 or /c/ or /channel/ 以外を弾く
    if (!url.includes("youtube.com")) {
      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("有効な YouTube のチャンネルURL を入力してください。");

      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    try {
      // ---- HTML 取得 ----
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "ja-JP",
        },
      });

      const html = res.data;

      // ---- ytInitialData 抽出 ----
      const regex = /var ytInitialData = ({.*?});<\/script>/s;
      const found = html.match(regex);

      if (!found) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("抽出失敗")
          .setDescription("YouTube のデータ解析に失敗しました。仕様変更の可能性があります。");

        return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      const jsonStr = found[1];
      const data = JSON.parse(jsonStr);

      // ---- チャンネルID と キーワード 抽出 ----
      const meta = data.metadata?.channelMetadataRenderer;

      if (!meta) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("取得エラー")
          .setDescription("チャンネル情報を取得できませんでした。");

        return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      const channelId = meta.externalId;
      const keywords = meta.keywords || "キーワード情報なし";

      const channelUrl = `https://www.youtube.com/channel/${channelId}`;

      // ---- 成功表示 ----
      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("📺 チャンネル情報取得")
        .addField("入力URL", url)
        .addField("チャンネルID", `\`${channelId}\``)
        .addField("チャンネルURL", `[${channelUrl}](${channelUrl})`)
        .addField("キーワード", keywords);

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);

      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("通信エラー")
        .setDescription("YouTube ページの取得中にエラーが発生しました。");

      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
