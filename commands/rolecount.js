const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        name: "rolecount",
        description: "ロールごとのメンバー数を集計します",
    },

    async execute(interaction) {
        try {
        const guild = interaction.guild;
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position);

        const list = roles
            .filter((r) => r.name !== "@everyone")
            .map((r) => `• **${r.name}**：${r.members.size}人`)
            .join("\n");

        const embed = new MessageEmbed()
            .setColor("E841C4")
            .setTitle("🎭 ロール別メンバー数")
            .setDescription(list || "ロールが見つかりませんでした。");

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        const errEmbed = new MessageEmbed()
            .setColor("FF0000")
            .setTitle("エラー発生")
            .setDescription("ロールの集計中にエラーが発生しました。");

        await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
    },
};
