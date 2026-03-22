const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "qr",
    description: "指定したURLをQRコードに変換して送信します",
    options: [
      { name: "url", description: "QRコード化したいURL", type: 3, required: true },
    ],
  },
  async execute(interaction) {
    const url = interaction.options.getString("url");
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

    const embed = new EmbedBuilder()
      .setColor("E841C4")
      .setTitle("QRコード化完了！")
      .setDescription(`URL: ${url} をQRコード化しました！`)
      .setImage(qrCodeUrl);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
