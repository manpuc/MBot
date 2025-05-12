const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "url-shortening",
    description: "URLを短縮します",
    options: [
      {
        name: "url",
        type: 3, // STRING
        description: "短縮するURL",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const url = interaction.options.getString("url");

    // Use dynamic import to load node-fetch
    const fetch = (await import("node-fetch")).default;

    // CleanURIのAPIを使用してURLを短縮
    const response = await fetch(`https://cleanuri.com/api/v1/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      const shortenedUrl = data.result_url;

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("URL Shortening!!")
        .addField("元のURL", url)
        .addField("短縮URL", shortenedUrl);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      // エラーが発生した場合の処理
      await interaction.reply("URLの短縮中にエラーが発生しました。");
    }
  },
};
