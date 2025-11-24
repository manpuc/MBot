const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: { name: "whois", description: "URL/IPからWhois情報を取得します", options: [{ name: "url", type: 3, description: "対象URL/IP", required: true }] },
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      let input = interaction.options.getString("url");
      if (!/^https?:\/\//i.test(input)) input = "http://" + input;
      const ip = new URL(input).hostname;

      const res = await axios.get(`https://ipwhois.app/json/${ip}`);
      const data = res.data;

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("Whois情報")
        .addFields(
          { name: "IP / ドメイン", value: ip },
          { name: "国", value: data.country || "不明" },
          { name: "会社 / ISP", value: data.org || "不明" },
          { name: "AS番号", value: data.asn || "不明" }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)] });
    }
  },
};
