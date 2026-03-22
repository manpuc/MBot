const { MessageEmbed } = require("discord.js");

const giveaways = new Map(); //データを格納するマップ

module.exports = {
  data: {
    name: "lottery",
    description: "抽選を開始します",
    options: [
      {
        name: "title",
        description: "抽選のタイトル",
        type: 3, // 文字列
        required: true,
      },
      {
        name: "explanatory",
        description: "抽選の説明文",
        type: 3, // 文字列
        required: true,
      },
      {
        name: "time",
        description: "締め切りまでの時間（分）",
        type: 4, // 整数
        required: true,
      },
    ],
  },
  async execute(interaction) {
    try {
      const title = interaction.options.getString("title");
      const explanatory = interaction.options.getString("explanatory");
      const time = interaction.options.getInteger("time");

      if (!title || !explanatory || !time) {
        await interaction.reply("タイトル、説明文、時間は必須です。");
        return;
      }

      const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(15221188)
        .setDescription(explanatory);

      const pollChannel = interaction.channel;
      const pollMessage = await pollChannel.send({ embeds: [embed] });

      // 🎫のリアクションを追加
      await pollMessage.react("🎫");

      // タイマーをセット
      const endTime = Date.now() + time * 60 * 1000;

      giveaways.set(pollMessage.id, {
        endTime,
        channelId: pollChannel.id,
      });

      // タイマーを非同期で待つ
      await new Promise(resolve => setTimeout(resolve, time * 60 * 1000));

      // 抽選を行う
      const giveawayData = giveaways.get(pollMessage.id);
      if (!giveawayData) {
        throw new Error("かなしいなぁ、抽選データが見つかりません。");
      }

      const message = await pollChannel.messages.fetch(pollMessage.id);

      // 🎫をクリックしたユーザーを取得
      const reaction = message.reactions.cache.get("🎫");
      const participants = await reaction.users.fetch(); // 参加者をフェッチ

      // ボットを除外
      participants.delete(message.client.user.id);

      // ランダムに一人を選ぶ
      const winner = participants.random();

      // 抽選結果を表示するエンベッドを作成
      const winnerEmbed = new MessageEmbed()
        .setTitle("抽選結果")
        .setColor(15221188)
        .setDescription(`いえーい！\n当選者は ${winner} だ！`);

      // 抽選結果を送信
      await pollChannel.send({ embeds: [winnerEmbed] });

      // プレゼントのデータを削除
      giveaways.delete(pollMessage.id);
    } catch (error) {
      console.error("えろー:", error);
      await interaction.reply("えろー。");
    }
  },
};
