const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: {
    name: "thread-make",
    description: "スレッドを作成します",
    options: [{ name: "thread-name", description: "スレッドの名前", type: 3, required: true }],
  },
  async execute(interaction) {
    try {
      // スレッド作成権限があるか確認
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageThreads)) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("スレッドを作成する権限がありません。")], ephemeral: true });
      }

      const name = interaction.options.getString("thread-name");
      const thread = await interaction.channel.threads.create({ name, autoArchiveDuration: 60 });

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("スレッド作成")
        .setDescription(`スレッド "${name}" が作成されました！`)
        .addFields(
          { name: "スレッドURL", value: `https://discord.com/channels/${interaction.guild.id}/${thread.id}` },
          { name: "スレッドID", value: thread.id }
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
