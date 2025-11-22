const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "memo",
    description: "DMでメモを開始します",
  },
  async execute(interaction) {
    const user = interaction.user;

    const embedStart = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("メモ開始！")
      .setDescription("メモを開始します！ \n メモを終了するには 'end' と送信してください.");

    await user.send({ embeds: [embedStart] });

    const filter = (message) => message.author.id === user.id;
    const collector = user.dmChannel.createMessageCollector({ filter, time: 60000 }); // ユーザーのDMチャンネルでメッセージを収集

    let memoText = ""; // メモの内容を保持する変数

    collector.on("collect", (message) => {
      if (message.content.toLowerCase() === "end") {
        // ユーザーが "end" と送信したらメモ作成を終了
        collector.stop();
        return;
      }

      // メモの内容を memoText に追加
      memoText += `${message.content}\n`;
    });

    collector.on("end", () => {
      // メモ収集が終了したら、結果をユーザーに送信
      const now = new Date(); // 現在の日時を取得
      const formattedDate = now.toLocaleString(); // 日時を文字列にフォーマット
      const embedMemo = new MessageEmbed()
        .setColor("E841C4")
        .setTitle(`メモ📝 (${formattedDate})`) // メモの日付をEmbedのタイトルに追加
        .setDescription(memoText);

      user.send({ embeds: [embedMemo] });
    });

    // メモ収集が終了するのを待つ代わりに、タイマーを設定して60秒後に自動的に終了する
    setTimeout(() => {
      if (!collector.ended) {
        collector.stop();
      }
    }, 60000);
    const now = new Date(); // 現在の日時を取得
    const formattedDate = now.toLocaleString(); // 日時を文字列にフォーマット
    const embedResponse = new MessageEmbed()
    
      .setColor("E841C4")
      .setDescription(`DMでメモを開始しました！(${formattedDate})`);

    await interaction.reply({ embeds: [embedResponse], ephemeral: true });
  },
};
