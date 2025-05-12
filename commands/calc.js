const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "calc",
    description: "指定された数式を計算します",
    options: [
      {
        name: "formula",
        description: "計算する数式を入力してください",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const formula = interaction.options.getString("formula");
    let result;

    try {
      // 数式の中の数字を置換
      const replacedFormula = formula
        .replace(/１/g, "1")
        .replace(/２/g, "2")
        .replace(/３/g, "3")
        .replace(/４/g, "4")
        .replace(/５/g, "5")
        .replace(/６/g, "6")
        .replace(/７/g, "7")
        .replace(/８/g, "8")
        .replace(/９/g, "9")
        .replace(/０/g, "0")
        .replace(/＋/g, "+")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/ー/g, "-")
        .replace(/ /g, "")
        .replace(/　/g, "")
        ;
      // 数式を評価
      result = eval(replacedFormula);
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("計算エラー")
        .setDescription("数式の計算中にエラーが発生しました。正しい数式を入力してください。");
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setColor(15221188)
      .setTitle("計算結果")
      .setDescription(`計算結果: ${result}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
