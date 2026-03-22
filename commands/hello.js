module.exports = {
  data: { name: "hello", description: "あいさつを返す" },
  async execute(interaction) {
    try {
      await interaction.reply(`${interaction.user} ごきげんよう`);
    } catch (err) {
      console.error("helloコマンドエラー:", err);
    }
  },
};
