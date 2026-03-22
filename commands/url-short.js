const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: { name: "url-short", description: "URLを短縮します", options: [{ name: "url", type: 3, description: "短縮するURL", required: true }] },
  async execute(interaction) {
    try {
      const url = interaction.options.getString("url");
      const fetch = (await import("node-fetch")).default;

      const res = await fetch("https://cleanuri.com/api/v1/shorten", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });

      if (!res.ok) throw new Error("URL短縮APIエラー");
      const data = await res.json();

      await interaction.reply({ embeds: [new EmbedBuilder().setColor("E841C4").setTitle("URL Shortened").addFields({ name: "元のURL", value: url }, { name: "短縮URL", value: data.result_url })], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
