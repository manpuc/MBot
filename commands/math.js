const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: {
    name: "math",
    description: "指定された数式を計算します",
    options: [
      {
        name: "formula",
        description: "計算する数式を入力してください",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const formula = interaction.options.getString("formula");
    let result;

    try {
      const replacedFormula = formula
        .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248))
        .replace(/＋/g, "+")
        .replace(/ー/g, "-")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\s+/g, "");

      result = eval(replacedFormula);
    } catch {
      const embed = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("計算エラー")
        .setDescription("数式の計算中にエラーが発生しました。正しい数式を入力してください。");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("計算結果")
      .setDescription(`計算結果: ${result}`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
