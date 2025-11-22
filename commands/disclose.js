const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "disclose",
    description: "コマンドの使用者に関する情報をまとめて送信します。",
    options: [
      {
        name: "ephemeral",
        description: "他のユーザーに表示するかどうかを選択してください。",
        type: 5, // type 5 は真偽値
        required: true,
      },
    ],
  },
  async execute(interaction) {
    try {
      const isEphemeral = interaction.options.getBoolean("ephemeral");

      // 使用者に関する情報を取得
      const user = interaction.user;
      const userId = user.id;
      const userTag = user.tag.replace(/#0$/, ''); // #0 を削除
      const userAvatar = user.avatarURL();

      // ユーザーのステータスを取得
      const status = user.presence ? user.presence.status : "習得できませんでした。";

      // ユーザーが通話中であるかを取得
      const inCall = user.presence ? user.presence.activities.some(activity => activity.type === 'VOICE') : "通話中ではありません";

      // ユーザーが通話しているチャンネルを取得
      const voiceChannel = user.presence?.member?.voice.channel;
      const callChannel = voiceChannel ? voiceChannel.name : "通話しているチャンネルなし";

      // サーバーに入った日時を取得
      const member =
        interaction.guild.members.cache.get(userId) ||
        (await interaction.guild.members.fetch(userId));
      if (!member) {
        throw new Error("このコマンドはサーバーでの使用が必要です。");
      }

      const userMessages = member.messages ? member.messages.cache : null;
      const messageCount = userMessages
        ? userMessages.filter((msg) => !msg.author.bot).size
        : "習得できませんでした。"; // 発言数が取得できない場合は「習得できませんでした。」と表示

      // 自分の権限を取得
      const permissions = member.permissions
        .toArray()
        .map((perm) => perm.replace(/_/g, " ").toLowerCase());

      // ユーザーのロール情報を取得
      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position) // ロールを位置順にソート
        .filter((role) => role.name !== "@everyone") // @everyoneロールを除外
        .map((role) => {
          return {
            name: role.name,
            color: role.color ? role.color.toString(16) : "#000000",
          };
        }); // ロール名と色の配列を作成

      // サーバー名を取得
      const serverName = interaction.guild.name;

      // サーバーに入った日時を取得し、joinDate 変数として定義
      const joinDate = member.joinedAt;

      // ユーザーがサーバーをブーストした回数を取得
      const boosts = member.premiumSince ? member.premiumSince.toString() : "習得できませんでした。";

      // ユーザーがDISCORD NITROを購読しているかを取得
      const nitro = user.premium ? "購読中" : "購読していません";

      // ユーザーのニックネームを取得
      const nickname = member.nickname || "なし";
      // ユーザーのプレイ中のゲームを取得
      const game = user.presence?.activities.find(activity => activity.type === 'PLAYING');
      const playingGame = game ? game.name : "プレイ中のゲームなし";

      // ユーザーのステータスを取得

      // ユーザーがサーバーでミュートされているかを取得
      const isMuted = member.voice && member.voice.serverMute ? "ミュート中" : "ミュートされていません";

      // ユーザーがサーバースピーカーミュートされているかを取得
      const isServerMuted = member.voice && member.voice.serverDeaf ? "スピーカーミュート中" : "スピーカーミュートされていません";

      // 最終発言日時を取得
      const lastMessageDate = user.lastMessage ? user.lastMessage.createdAt.toLocaleString() : "習得できませんでした。";

      // Embedを作成
      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("ユーザー情報")
        .setDescription("以下はあなたに関する情報です。")
        .setThumbnail(userAvatar)
        .addFields(
          { name: "サーバー名", value: serverName },
          { name: "ユーザーID", value: userId },
          { name: "ユーザータグ", value: userTag },
          { name: "サーバーに入った日時", value: joinDate ? joinDate.toLocaleString() : "習得できませんでした。" },
          { name: "発言数", value: messageCount },
          { name: "権限", value: permissions.join(", ") },
          { name: "ロール", value: roles.map((role) => `${role.name} (${role.color})`).join("\n") },
          { name: "ステータス", value: status },
          { name: "サーバーブースト回数", value: boosts },
          { name: "DISCORD NITRO", value: nitro },
          { name: "ニックネーム", value: nickname },
          { name: "サーバーミュート状態", value: isMuted },
          { name: "サーバースピーカーミュート状態", value: isServerMuted },
          { name: "最終発言日時", value: lastMessageDate },
          { name: "プレイ中のゲーム", value: playingGame }, // プレイ中のゲーム情報を追加
        );

      // セージを返信または送信
      if (isEphemeral) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        const channel = interaction.channel;
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      // エラーメッセージを送信
      await interaction.reply({ content: "エラーが発生しました。もう一度お試しください。", ephemeral: true });
    }
  },
};
