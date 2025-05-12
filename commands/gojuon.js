const { MessageEmbed } = require("discord.js");

module.exports = {
  data: {
    name: "gojuon",
    description: "日本語の五十音順の表を表示します",
  },
  async execute(interaction) {
    // 五十音順のデータを作成
    const japaneseAlphabet = [
      "あ", "い", "う", "え", "お",
      "か", "き", "く", "け", "こ",
      "さ", "し", "す", "せ", "そ",
      "た", "ち", "つ", "て", "と",
      "な", "に", "ぬ", "ね", "の",
      "は", "ひ", "ふ", "へ", "ほ",
      "ま", "み", "む", "め", "も",
      "や", "ゆ", "よ",
      "ら", "り", "る", "れ", "ろ",
      "わ", "を", "ん"
    ];

    // 五十音順にソート
    japaneseAlphabet.sort();

    // 五十音順の表を生成
    const rows = [];
    let currentRow = "";
    japaneseAlphabet.forEach(character => {
      if (currentRow.length + character.length > 25) {
        rows.push(currentRow);
        currentRow = "";
      }
      currentRow += character + " ";
    });
    rows.push(currentRow); // 最後の行を追加

    const alphabetTable = rows.join("\n");

    const embed = new MessageEmbed()
      .setColor("E841C4")
      .setTitle("五十音順さん")
      .setDescription(alphabetTable);

    await interaction.reply({ embeds: [embed] });
  },
};
