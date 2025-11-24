const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "count",
    description: "文字数をカウントします",
    options: [
      { name: "text", type: ApplicationCommandOptionType.String, description: "文字列入力", required: false },
      { name: "file", type: ApplicationCommandOptionType.Attachment, description: "テキストファイル", required: false },
    ],
  },
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      let content = interaction.options.getString("text");
      const file = interaction.options.getAttachment("file");

      if (!content && file) {
        if (!file.name.endsWith(".txt")) return interaction.editReply("テキストファイルのみ対応です。");
        const res = await axios.get(file.url);
        content = res.data;
      }

      if (!content) return interaction.editReply("文字列かテキストファイルを入力してください。");

      const embed = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle("文字数カウント結果")
        .setDescription(`文字数は **${content.length}** 文字です。`);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("countコマンドエラー:", error);
      await interaction.editReply({ content: "エラーが発生しました。", ephemeral: true });
    }
  },
};
