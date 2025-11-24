const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("animal")
    .setDescription("ランダムな動物の画像を返します"),

  async execute(interaction) {
    try {
      if (!interaction.deferred) await interaction.deferReply();

      const response = await axios.get("https://api.unsplash.com/photos/random", {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
        },
        params: {
          query: "animal",
          orientation: "landscape"
        }
      });

      const photo = response.data;
      if (!photo || !photo.urls) return interaction.editReply("画像が見つかりませんでした。");

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("🐾 Random Animal")
        .setImage(photo.urls.regular)
        .setFooter({ 
          text: `Photo by ${photo.user.name} on Unsplash`,
          iconURL: "https://images.unsplash.com/profile-fb-160..." // アイコン省略可
        })
        .setURL(photo.links.html);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("コマンド実行中にエラーが発生しました。");
      } else {
        await interaction.reply({ content: "コマンド実行中にエラーが発生しました。", ephemeral: true });
      }
    }
  }
};
