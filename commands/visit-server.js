const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "visit-server",
    description: "指定されたURLのサーバーの状態を確認します",
    options: [
      {
        name: "url",
        description: "チェックするサーバーのURL",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    let url = interaction.options.getString("url");

    // HTTPプロトコルが含まれていない場合、追加する
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const embed = new MessageEmbed()
          .setColor("00FF00")
          .setTitle("サーバーステータス")
          .setDescription(`${url} はオンラインです`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new MessageEmbed()
          .setColor("FF0000")
          .setTitle("サーバーステータス")
          .setDescription(`${url} はオフラインです`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("サーバーステータス")
        .setDescription(`エラー: ${error.message}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
