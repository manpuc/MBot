const { MessageEmbed, TextChannel } = require("discord.js");

module.exports = {
  data: {
    name: "unmuteall-timer",
    description:
      "指定された分数と秒数のタイマーが終了した後に通話に参加している全員のミュートを解除します。",
    options: [
      {
        name: "minutes",
        description: "タイマーの分数を指定してください（最大15分）。",
        type: 4, // type 4 は整数
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
      const channel = interaction.member.voice.channel;

      if (!channel) {
        const finishedTimerErrEmbed = new MessageEmbed()
          .setColor(15221188)
          .setTitle("えろー")
          .setDescription(`通話に参加している必要があります。`);
        await interaction.followUp({ embeds: [finishedTimerErrEmbed] });
        return;
      }

      try {
        for (const member of channel.members.values()) {
          await member.voice.setMute(false);
        }
        const finishedEmbed = new MessageEmbed()
          .setColor(15221188)
          .setTitle("タイマー終了")
          .setDescription(
            "タイマーが終了し、通話に参加している全員のミュートが解除されました。"
          );
        await interaction.followUp({ embeds: [finishedEmbed] });
      } catch (error) {
        console.error(`Failed to unmute all members: ${error}`);
        await interaction.followUp(
          "エラーが発生しました。全員のミュートを解除できませんでした。"
        );
      }
    }, totalSeconds * 1000);
  },
};
