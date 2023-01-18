const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports 

data: new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll and send it to a certain channel") .setDefaultMemberPermissions (PermissionFlagsBits.Administrator)
  .addStringOption (option =>
    option.setName("description")
    .setDescription("Describe the poll.")
    .setRequired(true)
  )
.addChannelOption (option =>
  option.setName("channel") 
  .setDescription("Where do you want to send the poll to?")
  .setRequired(true)
),
  async execute (interaction){
    const { options } = interaction;
}