const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "iss",
    description: "国際宇宙ステーション（ISS）の現在位置を表示します",
  },

  async execute(interaction) {
    try {
      // ---- ISS 現在位置取得 ----
      const response = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
      const issData = response.data;

      const lat = issData.latitude;
      const lon = issData.longitude;

      // ---- Geoapify Static Map ----
      const apiKey = process.env.GEOAPIFY_API_KEY;

      const mapUrl =
        `https://maps.geoapify.com/v1/staticmap?` +
        `style=osm-carto&width=800&height=400&` +
        `center=lonlat:${lon},${lat}&zoom=2&` +
        `marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&` +
        `apiKey=${apiKey}`;

      // ---- Embed 作成 ----
      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("🛰 国際宇宙ステーション（ISS）の現在位置")
        .setDescription("下のマップ上で ISS の現在位置を確認できます。")
        .addFields(
          { name: "緯度", value: lat.toFixed(4), inline: true },
          { name: "経度", value: lon.toFixed(4), inline: true }
        )
        .setImage(mapUrl);

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
      console.error("ISS位置情報取得エラー:", error);

      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("ISS の位置情報を取得できませんでした。");

      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
