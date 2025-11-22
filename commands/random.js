const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "random",
    description: "入力された内容をランダムで一つ決めます",
    options: [
      {
        name: "choices",
        description: "選択肢を入力してください",
        type: 3, // 文字列
        required: true,
      },
      {
        name: "title",
        description: "タイトルを入力してください",
        type: 3, // 文字列
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const choices = interaction.options.getString("choices");
    const pollTitle = interaction.options.getString("title");

    if (!choices || !pollTitle) {
      await interaction.reply("選択肢とタイトルは必須です。");
      return;
    }

    const choicesArray = choices.split(" ");
    const randomChoice = choicesArray[Math.floor(Math.random() * choicesArray.length)];

    const embed = new MessageEmbed()
      .setTitle(pollTitle)
      .setColor(15221188)
      .setDescription("ランダムな選択肢を送信します！")
      .addField("でーん", randomChoice);

    const pollChannel = interaction.channel;
    const pollMessage = await pollChannel.send({ embeds: [embed] });
  },
};
