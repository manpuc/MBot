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

module.exports = {
  data: {
    name: "remove-report-channel",
    description: "報告用のチャンネルを削除する",
  },
  async execute(interaction) {
    // サーバーの報告用チャンネルIDを削除する処理を実装します
    const guildId = interaction.guild.id;

    // データファイルから報告用チャンネルIDを削除
    const reportChannels = readReportChannelsData();
    delete reportChannels[guildId];

    // データファイルに更新後のデータを保存
    const jsonData = JSON.stringify(reportChannels, null, 2);
    fs.writeFileSync("./data/reportChannels.json", jsonData);

    const SuccessEmbed = new MessageEmbed()
      .setColor("#008000")
      .setTitle("報告用チャンネルが削除されました")
      .setDescription("報告用チャンネルの設定が削除されました。");

    await interaction.reply({ embeds: [SuccessEmbed] });
  },
};
