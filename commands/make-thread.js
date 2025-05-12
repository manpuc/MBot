const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "make-thread",
    description: "スレッドを作成します",
    options: [
      {
        name: "thread-name",
        description: "スレッドの名前",
        type: 3, // 3はSTRINGを表します
        required: true,
      },
    ],
  },
  async execute(interaction) {
    // コマンドからスレッド名を取得
    const threadName = interaction.options.getString("thread-name");

    // スレッドを作成
    const threadChannel = await interaction.channel.threads.create({
      name: threadName,
      autoArchiveDuration: 60, // スレッドの自動アーカイブ時間を60分に設定
    });

    // スレッドのURLを生成
    const threadURL = `https://discord.com/channels/${interaction.guild.id}/${threadChannel.id}`;

    // Embedを作成してスレッドのURLとIDを埋め込む
    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("スレッド作成")
      .setDescription(`スレッド "${threadName}" が作成されました！`)
      .addFields(
        { name: "スレッドURL", value: threadURL },
        { name: "スレッドID", value: threadChannel.id }
      ); // スレッドのURLとIDを埋め込む

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
