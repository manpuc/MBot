const { MessageEmbed } = require("discord.js");
const axios = require("axios"); // QRコードを生成するためにaxiosを使用

module.exports = {
  data: {
    name: "qr",
    description: "指定したURLをQRコードに変換して送信します",
    options: [
      {
        name: "url",
        description: "QRコード化したいURL",
        type: 3, // 文字列型
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const url = interaction.options.getString("url"); // ユーザーが提供したURLを取得

    try {
      // QRコードAPIを使用してQRコードを生成
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

      const embed = new MessageEmbed()
        .setColor("E841C4")
        .setTitle("QRコード化完了！！！")
        .setDescription(`URL: ${url} \n をQRコード化しました！`)
        .setImage(qrCodeUrl); // 画像フィールドにQRコードのURLを設定

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply("QRコードを生成できませんでした。");
    }
  },
};
