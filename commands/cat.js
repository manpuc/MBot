const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "cat",
    description: "ねこを感じられます",
  },
  async execute(interaction) {
    try {
      const response = await axios.get("https://cataas.com/cat/gif");
      const imageUrl = response.request.res.responseUrl;

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("Random Cat")
        .setImage(imageUrl);

      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error("An error occurred:", error);
      await interaction.reply("An error occurred while fetching a cat GIF.");
    }
  },
};
