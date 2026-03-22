const { EmbedBuilder } = require("discord.js");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  data: { name: "uuid", description: "UUIDを生成します" },
  async execute(interaction) {
    try {
      const id = uuidv4();
      const embed = new EmbedBuilder().setColor("E841C4").setTitle("UUID").setDescription(id);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
