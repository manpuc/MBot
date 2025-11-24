const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
  data: { name: "thread-delete", description: "スレッドを削除します" },
  async execute(interaction) {
    try {
      if (!interaction.channel.isThread()) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("このコマンドはスレッド上でのみ使用できます。")], ephemeral: true });
      }

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageThreads)) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("スレッドを削除する権限がありません。")], ephemeral: true });
      }

      const embed = new EmbedBuilder().setColor("E841C4").setTitle("スレッド削除の確認").setDescription(`スレッド "${interaction.channel.name}" を削除しますか？`);
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("delete_thread_confirmation").setStyle(ButtonStyle.Danger).setLabel("削除する"),
        new ButtonBuilder().setCustomId("delete_thread_cancel").setStyle(ButtonStyle.Primary).setLabel("キャンセル")
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on("collect", async i => {
        if (i.customId === "delete_thread_confirmation") {
          try {
            await interaction.channel.delete();
            // スレッド削除後は update せず interaction を完了させる
            await i.deferUpdate();
          } catch (err) {
            await i.update({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("スレッド削除中にエラーが発生しました。")], components: [] });
          }
        } else {
          await i.update({ embeds: [new EmbedBuilder().setColor("E841C4").setDescription("削除をキャンセルしました。")], components: [] });
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time" && collected.size === 0) {
          interaction.editReply({ embeds: [new EmbedBuilder().setColor("E841C4").setDescription("確認タイムアウトしました。")], components: [] });
        }
      });

    } catch (error) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${error.message}`)], ephemeral: true });
    }
  },
};
