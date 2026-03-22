const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "memo",
    description: "DMでメモを開始します",
  },
  async execute(interaction) {
    const user = interaction.user;

    const embedStart = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("メモ開始！")
      .setDescription("メモを開始します！ \n メモを終了するには 'end' と送信してください.");

    const dm = await user.send({ embeds: [embedStart] });
    const collector = dm.channel.createMessageCollector({ filter: m => m.author.id === user.id, time: 60000 });

    let memoText = "";
    collector.on("collect", message => {
      if (message.content.toLowerCase() === "end") return collector.stop();
      memoText += message.content + "\n";
    });

    collector.on("end", () => {
      const embedMemo = new EmbedBuilder()
        .setColor("E841C4")
        .setTitle(`メモ📝 (${new Date().toLocaleString()})`)
        .setDescription(memoText || "メモはありませんでした。");
      user.send({ embeds: [embedMemo] });
    });

    const embedResponse = new EmbedBuilder()
      .setColor("E841C4")
      .setDescription(`DMでメモを開始しました！ (${new Date().toLocaleString()})`);

    await interaction.reply({ embeds: [embedResponse], ephemeral: true });
  },
};
