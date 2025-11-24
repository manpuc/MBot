const { EmbedBuilder, CommandInteraction, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  data: {
    name: "bmi",
    description: "BMIを計算します",
    options: [
      { name: "weight", description: "体重（kg）", type: ApplicationCommandOptionType.String, required: true },
      { name: "height", description: "身長（cm）", type: ApplicationCommandOptionType.String, required: true },
    ],
  },
  async execute(interaction) {
    if (!(interaction instanceof CommandInteraction)) return;

    const weight = parseFloat(interaction.options.getString("weight"));
    const height = parseFloat(interaction.options.getString("height")) / 100;
    const bmi = weight / (height * height);

    let status = "";
    if (bmi < 18.5) status = "やせ";
    else if (bmi < 24.9) status = "標準体重";
    else if (bmi < 29.9) status = "肥満（1度）";
    else if (bmi < 34.9) status = "肥満（2度）";
    else if (bmi < 39.9) status = "肥満（3度）";
    else status = "肥満（4度）";

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("BMI計算結果")
      .addFields(
        { name: "体重", value: `${weight} kg`, inline: true },
        { name: "身長", value: `${height} m`, inline: true },
        { name: "BMI", value: bmi.toFixed(2), inline: true },
        { name: "判定", value: status, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
