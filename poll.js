const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("簡易的な投票('⭕'or'❌')")
        .setDefaultMemberPermissions (PermissionFlagsBits.Administrator)
        .addStringOption (option =>
            option.setName("description")
                .setDescription("なんの")
                .setRequired(true)
        )
        .addChannelOption (option =>
            option.setName("channel") 
                .setDescription("どこで")
                .setRequired(true)
        ),
    async execute(interaction){
        const { options } = interaction;
      
        const channel = options.getChannel("channel");
        const description = options.getString("description");
        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setDescription(description)
            .setTimestamp();
        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react("⭕");
            await m.react("❌");
            await interaction.reply({ content: "問題なく動作", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}
