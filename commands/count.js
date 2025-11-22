const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    name: "count",
    description: "送信した文字またはテキストファイル内の文字数をカウントします",
    options: [
      {
        name: "text",
        type: 3, // STRING
        description: "カウントする文字列を入力してください",
        required: false,
      },
      {
        name: "file",
        type: 11, // ATTACHMENT
        description: "テキストファイルを添付してください",
        required: false,
      },
    ],
  },

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const inputText = interaction.options.getString("text");
      const inputFile = interaction.options.getAttachment("file");
      let content = "";

      if (inputText) {
        content = inputText;

      } else if (inputFile) {
        if (!inputFile.name.endsWith(".txt")) {
          const embed = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("エラー")
            .setDescription("テキストファイル（.txt）のみ対応しています。");
          return interaction.editReply({ embeds: [embed] });
        }

        const res = await axios.get(inputFile.url);
        content = res.data;

      } else {
        const embed = new MessageEmbed()
          .setColor("#FF0000")
          .setTitle("エラー")
          .setDescription("文字列かテキストファイルを入力してください。");
        return interaction.editReply({ embeds: [embed] });
      }

      const charCount = content.length;

      const embed = new MessageEmbed()
        .setColor("#E841C4")
        .setTitle("文字数カウント結果")
        .setDescription(`入力された内容の文字数は **${charCount}** 文字です。`);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("countコマンドでエラー:", error);

      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("エラー発生")
        .setDescription(`文字数カウント中にエラーが発生しました。\n\n\`${error.message}\``);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
