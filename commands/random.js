const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "random",
    description: "入力された内容をランダムで一つ決めます",
    options: [
      { name: "choices", description: "選択肢を入力してください", type: 3, required: true },
      { name: "title", description: "タイトルを入力してください", type: 3, required: true },
    ],
  },
  async execute(interaction) {
    const choices = interaction.options.getString("choices")?.split(" ");
    const title = interaction.options.getString("title");

    if (!choices || !title) return interaction.reply({ content: "選択肢とタイトルは必須です。", ephemeral: true });

    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor("E841C4")
      //.setDescription("ランダムな選択肢はこちら")
      .addFields({ name: "でーん", value: randomChoice });
      await interaction.reply({ embeds: [embed] });
    //await interaction.channel.send({ embeds: [embed] });
    //await interaction.reply({ content: "ランダム選択を送信しました！", ephemeral: true });
  },
};
