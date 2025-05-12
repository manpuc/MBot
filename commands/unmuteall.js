const { MessageEmbed, TextChannel } = require("discord.js");

module.exports = {
  data: {
    name: "unmuteall",
    description: "通話に参加している全員のミュートを解除します",
  },
  async execute(interaction) {
    // 追加: ミュート解除全員コマンドの処理
    const channel = interaction.member.voice.channel;

    if (!channel) {
      await interaction.reply("通話に参加している必要があります。");
      return;
    }

    try {
      for (const member of channel.members.values()) {
        await member.voice.setMute(false);
      }
      await interaction.reply(
        "通話に参加している全員のミュートを解除しました。"
      );
    } catch (error) {
      console.error(`Failed to unmute all members: ${error}`);
      await interaction.reply(
        "エラーが発生しました。全員のミュートを解除できませんでした。"
      );
    }
  },
};
