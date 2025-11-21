const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "whois",
    description: "URLまたはIPアドレスのWhois情報を取得します",
    options: [
      {
        type: 3,
        name: "query",
        description: "URL または IPアドレス",
        required: true,
      },
    ],
  },

  async execute(interaction) {
    try {
      let query = interaction.options.getString("query");

      // URL → hostname に変換
      try {
        if (query.startsWith("http")) {
          const u = new URL(query);
          query = u.hostname;
        }
      } catch (e) {
        // URLでなければ無視
      }

      const res = await fetch(`https://ipwho.is/${query}`);
      const data = await res.json();

      if (!data.success) {
        const errEmbed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("エラー")
          .setDescription("Whois情報を取得できませんでした。");

        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle(`🔍 Whois情報：${query}`)
        .addField("IP", data.ip || "N/A", true)
        .addField("国", `${data.country} (${data.country_code})`, true)
        .addField("地域", `${data.region} ${data.city}`, true)
        .addField("ISP", data.connection?.isp || "N/A", false)
        .addField("組織（Org）", data.connection?.org || "N/A", false)
        .addField("AS番号", data.connection?.asn?.toString() || "N/A", true)
        .setFooter({ text: "ipwho.is API を使用しています" });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー発生")
        .setDescription("Whois情報取得中にエラーが発生しました。");

      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
