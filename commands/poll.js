const { EmbedBuilder } = require("discord.js");

const numberEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

module.exports = {
  data: {
    name: "poll",
    description: "投票を開始します",
    options: [
      { name: "choices", description: "選択肢を入力してください", type: 3, required: true },
      { name: "title", description: "タイトルを入力してください", type: 3, required: true },
    ],
  },
  async execute(interaction) {
    let choices = interaction.options.getString("choices")?.split(" ");
    const title = interaction.options.getString("title");

    if (!choices || !title) {
      return interaction.reply({ content: "選択肢とタイトルは必須です。", ephemeral: true });
    }

    // 10個を超えた場合は制限
    if (choices.length > 10) {
      choices = choices.slice(0, 10);
    }

    // 応答を保留（ユーザーに見えない）
    await interaction.deferReply({ ephemeral: true });

    // Embed作成
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor("E841C4")
      .setDescription("投票を開始します！");

    choices.forEach((c, i) => embed.addFields({ name: numberEmojis[i], value: c }));

    // 投票メッセージ送信
    const pollMessage = await interaction.channel.send({ embeds: [embed] });

    // リアクションを同時に追加
    await Promise.all(choices.map((_, i) => pollMessage.react(numberEmojis[i])));

    // 保留応答を削除してユーザーに何も表示しない
    await interaction.deleteReply();
  },
};
