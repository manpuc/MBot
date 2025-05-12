const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "report",
    description: "ユーザーを報告する",
    options: [
      {
        name: "user",
        type: 6, // type 6 はユーザー
        description: "報告対象のユーザー",
        required: true,
      },
      {
        name: "content",
        type: 3, // type 3 は文字列
        description: "報告内容",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const reportedUser = interaction.options.getUser("user");
    const reportContent = interaction.options.getString("content");

    if (!reportedUser || !reportContent) {
      const ErrEmbed = new MessageEmbed()
        .setColor("#DC143C")
        .setTitle("エラー")
        .setDescription("報告対象のユーザーと内容を正しく指定してください。");
      await interaction.reply({ embeds: [ErrEmbed], ephemeral: true });
      return;
    }

    // 報告の処理をここに実装します
    // 例えば、特定の報告用チャンネルにメッセージを送信するなどの処理を行います

    // サーバーIDに対応する報告用チャンネルをファイルから読み込む
    const reportChannelId = readReportChannelData(interaction.guild.id);
    const reportChannel = interaction.guild.channels.cache.get(reportChannelId);

    if (!reportChannel) {
      const ErrEmbed = new MessageEmbed()
        .setColor("#DC143C")
        .setTitle("エラー")
        .setDescription("報告用のチャンネルが設定されていません。");
      await interaction.reply({ embeds: [ErrEmbed], ephemeral: true });
      return;
    }

    const reportEmbed = new MessageEmbed()
      .setColor("#008080")
      .setTitle("新しい報告があります")
      .addFields(
        { name: "報告対象", value: reportedUser.toString() },
        { name: "内容", value: reportContent }
      )
      .setTimestamp();

    try {
      await reportChannel.send({ embeds: [reportEmbed] });
      const successEmbed = new MessageEmbed()
        .setColor("#008000")
        .setTitle("報告が送信されました")
        .setDescription(
          `ユーザー ${reportedUser.toString()} の報告が送信されました。`
        );
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error("Error sending report:", error);
      const ErrEmbed = new MessageEmbed()
        .setColor("#DC143C")
        .setTitle("エラー")
        .setDescription(
          "報告を送信できませんでした。もう一度やり直してください。"
        );
      await interaction.reply({ embeds: [ErrEmbed], ephemeral: true });
    }
  },
};

function readReportChannelsData() {
  try {
    const jsonData = fs.readFileSync("./data/reportChannels.json");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading report channels data:", err);
    return {};
  }
}

function readReportChannelData(guildId) {
  const reportChannels = readReportChannelsData();
  return reportChannels[guildId] || "";
}
