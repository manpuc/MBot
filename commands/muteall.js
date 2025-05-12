const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "muteall",
    description: "通話に参加している全員をミュートにします",
  },
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply("通話に参加している必要があります。");
      return;
    }

    try {
      for (const member of channel.members.values()) {
        await member.voice.setMute(true);
      }
      await interaction.reply("通話に参加している全員をミュートにしました。");
    } catch (error) {
      console.error(`Failed to mute all members: ${error}`);
      await interaction.reply(
        "エラーが発生しました。全員をミュートできませんでした。"
      );
    }
  },
};
