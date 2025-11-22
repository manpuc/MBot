const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "dog",
    description: "いぬを感じられます",
  },
  async execute(interaction) {
    try {
      const response = await axios.get("https://dog.ceo/api/breeds/image/random");
      const imageUrl = response.data.message;

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("Random Dog")
        .setImage(imageUrl);

      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error("An error occurred:", error);
      await interaction.reply("An error occurred while fetching a dog image.");
    }
  },
};
