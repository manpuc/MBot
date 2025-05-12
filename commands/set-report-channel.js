const fs = require("fs");
const { MessageEmbed } = require("discord.js");
function readReportChannelsData() {
  try {
    const jsonData = fs.readFileSync("./data/reportChannels.json");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading report channels data:", err);
    return {};
  }
}
module.exports = {
  data: {
    name: "set-report-channel",
    description: "報告用のチャンネルを設定する",
    options: [
      {
        name: "channel_id",
        type: 3, // type 3 は文字列
        description: "報告用のチャンネルIDを指定してください",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const reportChannelId = interaction.options.getString("channel_id");
    const reportChannel = interaction.guild.channels.cache.get(reportChannelId);

    if (!reportChannel || reportChannel.type !== "GUILD_TEXT") {
      const ErrEmbed = new MessageEmbed()
        .setColor("#DC143C")
        .setTitle("エラー")
        .setDescription("有効なテキストチャンネルを指定してください。");
      await interaction.reply({ embeds: [ErrEmbed] });
      return;
    }

    // チャンネルを設定する処理をここに実装します
    // 例えば、サーバーの設定として報告用チャンネルを保存するなどの処理を行います
    // ここでは単純に設定したチャンネルを返信するだけとします
    const SuccessEmbed = new MessageEmbed()
      .setColor("#008000")
      .setTitle("報告用チャンネルが設定されました")
      .addFields(
        { name: "報告用チャンネル名", value: reportChannel.name },
        { name: "報告用チャンネルID", value: reportChannel.id }
      );
    await interaction.reply({ embeds: [SuccessEmbed] });

    // サーバーIDとチャンネルIDをファイルに保存する
    saveReportChannel(interaction.guild.id, reportChannelId);
  },
};

function saveReportChannel(guildId, channelId) {
  try {
    const reportChannels = readReportChannelsData();
    reportChannels[guildId] = channelId;
    const jsonData = JSON.stringify(reportChannels, null, 2);

    fs.writeFileSync("./data/reportChannels.json", jsonData);
  } catch (err) {
    console.error("Error saving report channels data:", err);
  }
}
