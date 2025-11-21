const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "ytid", // ← ここ修正。ファイル名と一致
    description: "YouTube URLから動画IDを抽出し短縮URLに変換します",
    options: [
      {
        name: "url",
        type: "STRING",
        description: "YouTube URL（例: https://www.youtube.com/watch?v=XXXXXXXXXXX）",
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const url = interaction.options.getString("url");

    // YouTube動画IDを抽出
    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
    if (!match) {
      const errEmbed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("エラー")
        .setDescription("有効な YouTube URL を入力してください。\n例: https://www.youtube.com/watch?v=XXXXXXXXXXX");

      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    const videoId = match[1];
    const oldUrl = `https://youtu.be/${videoId}`;

    const embed = new MessageEmbed()
      .setTitle("🎥 YouTube URL 変換結果")
      .addField("新しい形式", `[${url}](${url})`)
      .addField("短縮リンク", `[${oldUrl}](${oldUrl})`)
      .setColor("E841C4"); // ← 先輩のテーマカラー

    await interaction.reply({ embeds: [embed] });
  },
};
