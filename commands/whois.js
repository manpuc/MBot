const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "whois",
    description: "URLまたはIPアドレスからWhois情報を取得します",
    options: [
      {
        name: "url",
        description: "Whoisを取得するURLまたはIP",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      let input = interaction.options.getString("url");
      if (!/^https?:\/\//i.test(input)) {
        input = "http://" + input;
      }
      const urlObj = new URL(input);
      const ip = urlObj.hostname;

      const response = await axios.get(`https://ipwhois.app/json/${ip}`);

      const data = response.data;

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle("🌐 Whois情報")
        .addField("IP / ドメイン", ip)
        .addField("国", data.country || "不明")
        .addField("会社 / ISP", data.org || "不明")
        .addField("AS番号", data.asn || "不明");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー")
        .setDescription(`Whois取得中にエラーが発生しました。\n\`${error.message}\``);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
