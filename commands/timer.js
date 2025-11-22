const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "timer",
    description: "指定された分数と秒数のタイマーを開始します。",
    options: [
      {
        name: "minutes",
        description: "タイマーの分数を指定してください（最大15分）。",
        type: 4,
        required: true,
      },
      {
        name: "seconds",
        description: "タイマーの秒数を指定してください（最大59秒）。",
        type: 4,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    // ここにtimerコマンドのロジックを記述します
    const minutes = interaction.options.getInteger("minutes");
    const seconds = interaction.options.getInteger("seconds");

    if (minutes > 15) {
      await interaction.reply("タイマーの分数は最大15分までです。");
      return;
    }

    if (seconds > 59) {
      await interaction.reply("タイマーの秒数は最大59秒までです。");
      return;
    }

    const totalSeconds = minutes * 60 + seconds;

    const embed = new MessageEmbed()
      .setColor(15221188)
      .setTitle("タイマー開始")
      .setDescription(`タイマーを ${minutes} 分 ${seconds} 秒で開始します。`);

    await interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      const user = interaction.user;
      const mention = user.toString();

      const finishedEmbed = new MessageEmbed()
        .setColor(15221188)
        .setTitle("タイマー終了")
        .setDescription(`${mention} タイマーが終了しました！`);

      await interaction.followUp({ embeds: [finishedEmbed] });
    }, totalSeconds * 1000);
  },
};
