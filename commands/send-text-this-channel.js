const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "send-text-this-channel",
    description: "テキストを使用されたテキストチャンネルに送信します。",
    options: [
      {
        name: "text",
        description: "送信するテキストを入力してください。",
        type: 3,
        required: true,
      },
      {
        name: "anon",
        description: "匿名で送信するかどうかを選択してください。",
        type: 5,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const text = interaction.options.getString("text");
    const isAnonymous = interaction.options.getBoolean("anon");

    if (isAnonymous === undefined) {
      const errorEmbed = new MessageEmbed()
        .setColor(15221188)
        .setDescription("このオプションは必須です。");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }

    const embed = new MessageEmbed().setColor(15221188).setDescription(text);

    if (!isAnonymous) {
      embed.setAuthor(interaction.user.tag, interaction.user.avatarURL());
    }

    try {
      await interaction.channel.send({ embeds: [embed] });
      const successEmbed = new MessageEmbed()
        .setColor(15221188)
        .setDescription("テキストを送信しました。");
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error(`Failed to send text: ${error}`);
      const errorEmbed = new MessageEmbed()
        .setColor(15221188)
        .setDescription("テキストの送信に失敗しました。");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
