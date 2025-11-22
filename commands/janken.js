const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const choices = ["ぐー", "ちょき", "ぱー"];

module.exports = {
  data: {
    name: "janken",
    description: "MBotとじゃんけんできます",
  },
  async execute(interaction) {
    // ボタンを作成
    const buttons = choices.map((choice) =>
      new MessageButton()
        .setCustomId(choice)
        .setLabel(choice)
        .setStyle("PRIMARY")
    );

    // ボタンをボタン行に追加
    const buttonRow = new MessageActionRow().addComponents(buttons);

    // ユーザーにボタンを送信
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("じゃんけん")
      .setDescription("どの手を出す？")
      .addField("選択肢", choices.join(", "));

    await interaction.reply({
      embeds: [embed],
      components: [buttonRow],
      ephemeral: true,

    });

    // ボタンが押されたときの反応
    const filter = (i) => i.customId && choices.includes(i.customId);
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000, // 15秒間ボタンの入力を待つ
    });

    collector.on("collect", async (buttonInteraction) => {
      const userChoice = buttonInteraction.customId;
      const botChoice = choices[Math.floor(Math.random() * choices.length)];

      let result = "引き分け";
      if (
        (userChoice === "ぐー" && botChoice === "ちょき") ||
        (userChoice === "ちょき" && botChoice === "ぱー") ||
        (userChoice === "ぱー" && botChoice === "ぐー")
      ) {
        result = "やるやん";
      } else if (userChoice !== botChoice) {
        result = "なんで負けたか明日までに考えといてください";
      }

      const resultEmbed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("けっかはっぴょー")
        .addField(`${interaction.user.username}の出した手`, userChoice)
        .addField("MBotの出した手", botChoice)
        .addField("結果", result);

      // メッセージに返信
      buttonInteraction.reply({ embeds: [resultEmbed] });
    });

    collector.on("end", () => {
      // ボタン入力の受付が終了した場合の処理
      // ここで何か追加の処理を行うことができます
    });
  },
};