const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "timer",
    description: "指定時間でタイマーを開始します",
    options: [
      { name: "minutes", description: "分数（最大15）", type: 4, required: true },
      { name: "seconds", description: "秒数（最大59）", type: 4, required: true },
    ],
  },
  async execute(interaction) {
    try {
      const m = interaction.options.getInteger("minutes");
      const s = interaction.options.getInteger("seconds");

      if (m > 15 || s > 59) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription("時間の指定が範囲外です。")], ephemeral: true });
      }

      const total = m * 60 + s;
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("E841C4").setTitle("タイマー開始").setDescription(`${m}分${s}秒で開始します。`)] });

      setTimeout(async () => {
        await interaction.followUp({ embeds: [new EmbedBuilder().setColor("E841C4").setTitle("タイマー終了").setDescription(`${interaction.user} タイマーが終了しました！`)] });
      }, total * 1000);

    } catch (err) {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor("FF0000").setDescription(`エラー: ${err.message}`)], ephemeral: true });
    }
  },
};
