const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        name: "tyid", // ← コマンド名を変更
        description: "新しいYouTube URLから昔の形式のURLを出力します",
        options: [
        {
            name: "url",
            type: "STRING",
            description: "新しいYouTube URL（例: https://www.youtube.com/watch?v=XXXXXXXXXXX）",
            required: true,
        },
        ],
    },

    async execute(interaction) {
        const url = interaction.options.getString("url");

        // YouTube動画IDを抽出
        const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
        if (!match) {
            return await interaction.reply("❌ 有効なYouTube URLを入力してください（例: https://www.youtube.com/watch?v=XXXXXXXXXXX）");
        }

        const videoId = match[1];
        const oldUrl = `http://youtu.be/${videoId}`;

        const embed = new MessageEmbed()
            .setTitle("🎥 YouTube URL 変換結果")
            .addField("新", `[${url}](${url})`, false)
            .addField("旧", `[${oldUrl}](${oldUrl})`, false)
            .setColor("#FF0000");

    await interaction.reply({ embeds: [embed] });
    },
};
