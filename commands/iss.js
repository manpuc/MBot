const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: { name: "iss", description: "ISSの現在位置を表示" },
  async execute(interaction) {
    try {
      // 即座に defer してインタラクションを保留
      await interaction.deferReply({ ephemeral: true });

      const res = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
      const { latitude, longitude } = res.data;

      const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=800&height=400&center=lonlat:${longitude},${latitude}&zoom=2&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=${process.env.GEOAPIFY_API_KEY}`;

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("🛰 ISSの現在位置")
        .setDescription("下のマップでISSの位置を確認できます。")
        .setImage(mapUrl)
        .addFields(
          { name: "緯度", value: latitude.toFixed(4), inline: true },
          { name: "経度", value: longitude.toFixed(4), inline: true }
        );

      // defer したので editReply で送信
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("ISS APIエラー:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("ISSの位置情報を取得できませんでした。");

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
