const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "iss",
    description: "国際宇宙ステーション（ISS）の現在位置を取得します",
  },
  async execute(interaction) {
    try {
      const response = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
      const issData = response.data;

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("国際宇宙ステーション（ISS）の現在位置")
        .addFields(
          { name: "緯度", value: issData.latitude.toFixed(2) },
          { name: "経度", value: issData.longitude.toFixed(2) }
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("ISS位置情報の取得中にエラーが発生しました", error);
      await interaction.reply("ISS位置情報を取得できませんでした。");
    }
  },
};
