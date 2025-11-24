const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");

const choices = ["ぐー", "ちょき", "ぱー"];

module.exports = {
  data: { name: "janken", description: "MBotとじゃんけんできます" },
  async execute(interaction) {
    let tieCount = 0; // あいこの回数カウント

    const startJanken = async () => {
      const buttons = choices.map(choice =>
        new ButtonBuilder()
          .setCustomId(choice)
          .setLabel(choice)
          .setStyle(ButtonStyle.Primary)
      );
      const buttonRow = new ActionRowBuilder().addComponents(buttons);

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("じゃんけん")
        .setDescription("どの手を出す？");

      const replyMessage = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

      const collector = replyMessage.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id && choices.includes(i.customId),
        componentType: ComponentType.Button,
        time: 30000,
      });

      collector.on("collect", async i => {
        const userChoice = i.customId;
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = "あいこ";

        if (
          (userChoice === "ぐー" && botChoice === "ちょき") ||
          (userChoice === "ちょき" && botChoice === "ぱー") ||
          (userChoice === "ぱー" && botChoice === "ぐー")
        ) {
          result = "やるやん";
        } else if (userChoice !== botChoice) {
          result = "なんで負けたか明日までに考えといてください";
        }

        if (result === "あいこ") {
          tieCount++;
          let comment = "";
          if (tieCount === 1) comment = "すごいね";
          else if (tieCount >= 2 && tieCount <= 4) comment = "できるやん";
          else if (tieCount >= 5 && tieCount <= 9) comment = "ながいよー😭";
          else if (tieCount >= 10) comment = `MBotは怖気づいて逃げていった... ${interaction.user.username}の勝ち！ないすー！やるやん！！🎉🎉🎉`;

          const tieEmbed = new EmbedBuilder()
            .setColor("E841C4")
            .setTitle("あいこでしょ！")
            .setDescription(tieCount >= 10 ? comment : `あいこの回数: ${tieCount} 回\n${comment}`);

          await i.update({ embeds: [tieEmbed], components: tieCount >= 10 ? [] : [buttonRow] });

          if (tieCount >= 10) collector.stop();
        } else {
          // 勝敗が出た場合はボタン削除
          const resultEmbed = new EmbedBuilder()
            .setColor("E841C4")
            .setTitle("けっかはっぴょー")
            .addFields(
              { name: `${interaction.user.username}の出した手`, value: userChoice },
              { name: "MBotの出した手", value: botChoice },
              { name: "結果", value: result }
            );

          if (tieCount > 0) resultEmbed.addFields({ name: "あいこの回数", value: `${tieCount} 回` });

          await i.update({ embeds: [resultEmbed], components: [] });

          collector.stop();
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time" && collected.size === 0) {
          const timeoutEmbed = new EmbedBuilder()
            .setColor("FF0000")
            .setTitle("じゃんけん")
            .setDescription("タイムアウトしました。もう一度コマンドを実行してください。");

          replyMessage.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
        }
      });
    };

    await startJanken();
  },
};
