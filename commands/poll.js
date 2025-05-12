const { MessageEmbed } = require("discord.js");

const numberEmojis = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];

module.exports = {
  data: {
    name: "poll",
    description: "投票を開始します",
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

    const embed = new MessageEmbed()
      .setTitle(pollTitle)
      .setColor(15221188)
      .setDescription("投票を開始します！");

    for (let i = 0; i < choicesArray.length; i++) {
      embed.addField(`${numberEmojis[i]}`, choicesArray[i]);
    }

    const pollChannel = interaction.channel;
    const pollMessage = await pollChannel.send({ embeds: [embed] });

    for (let i = 0; i < choicesArray.length; i++) {
      await pollMessage.react(numberEmojis[i]);
    }
  },
};
