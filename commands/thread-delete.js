const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: {
    name: "thread-delete",
    description: "スレッドを削除します",
  },
  async execute(interaction) {
    // スレッドが存在するか確認
    if (!interaction.channel.isThread()) {
      return interaction.reply("このコマンドはスレッド上でのみ使用できます。");
    }

    // 確認メッセージを作成
    const confirmationEmbed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("スレッド削除の確認")
      .setDescription(
        `スレッド "${interaction.channel.name}" を削除しますか？`
      );

    // 確認用ボタンを作成
    const confirmationButton = new MessageButton()
      .setCustomId("delete_thread_confirmation")
      .setStyle("DANGER")
      .setLabel("削除する");

    // キャンセル用ボタンを作成
    const cancelButton = new MessageButton()
      .setCustomId("delete_thread_cancel")
      .setStyle("PRIMARY")
      .setLabel("キャンセル");

    // ボタンを含む行を作成
    const row = new MessageActionRow().addComponents(
      confirmationButton,
      cancelButton
    );

    // 確認メッセージを送信
    await interaction.reply({
      embeds: [confirmationEmbed],
      components: [row],
      ephemeral: true,
    });

    // ユーザーの反応を待機
    const filter = (i) =>
      i.customId === "delete_thread_confirmation" ||
      i.customId === "delete_thread_cancel";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000, // 15秒間待機
      max: 1,
    });

    // ユーザーの反応を処理
    collector.on("collect", async (i) => {
      if (i.customId === "delete_thread_confirmation") {
        try {
          // スレッドを削除
          await interaction.channel.delete();

          // 削除が成功したメッセージを送信
          const successEmbed = new MessageEmbed()
            .setColor("E841C4")
            .setTitle("スレッド削除")
            .setDescription(`スレッド "${interaction.channel.name}" を削除しました。`);

          await interaction.editReply({
            embeds: [successEmbed],
            components: [],
          });
        } catch (error) {
          console.error(error);
          return interaction.editReply("スレッドの削除中にエラーが発生しました。");
        }
      } else if (i.customId === "delete_thread_cancel") {
        // キャンセルが選択された場合はメッセージを更新して終了
        const cancelEmbed = new MessageEmbed()
          .setColor("E841C4")
          .setTitle("スレッド削除")
          .setDescription("スレッドの削除がキャンセルされました。");

        await interaction.editReply({
          embeds: [cancelEmbed],
          components: [],
        });
      }
    });

    // ユーザーの反応がない場合（タイムアウト）
    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        // タイムアウトが発生した場合はメッセージを更新して終了
        const timeoutEmbed = new MessageEmbed()
          .setColor("E841C4")
          .setTitle("スレッド削除")
          .setDescription("スレッド削除の確認がタイムアウトしました。");

        interaction.editReply({
          embeds: [timeoutEmbed],
          components: [],
        });
      }
    });
  },
};
