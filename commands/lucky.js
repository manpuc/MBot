const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lucky")
        .setDescription("0/1 の 50% を引き続けるシンプルゲーム！"),

    async execute(interaction) {
        await interaction.deferReply();

        let round = 1;
        let isGameOver = false;

        // 初回表示
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("🎮 すたーと！")
                    .setDescription(
                        `**Round 1 / 32**\n成功確率：**50%**\n\n⏱️ **10秒以内に 0 または 1 を選択してください**`
                    )
            ],
            components: generateButtons()
        });

        const collector = interaction.channel.createMessageComponentCollector({
            time: 1000 * 60 * 5
        });

        let roundTimeout = startRoundTimeout(interaction, round, () => endGameTimeout(interaction, round));

        collector.on("collect", async btn => {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: "これはあなたのゲームではありません！", ephemeral: true });
            }

            if (isGameOver) return;

            clearTimeout(roundTimeout);

            const chosen = btn.customId;
            const hit = Math.random() < 0.5 ? "0" : "1";

            const successRounds = round - 1;
            const successRate = (1 / (2 ** successRounds)) * 100;

            // ❌ 外れ
            if (chosen !== hit) {
                isGameOver = true;

                await btn.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("❌ Game Over")
                            .setDescription(
                                `**${successRounds} ラウンド成功！**` +
                                (successRounds > 0 ? `\nここまでの成功確率：**${formatPercent(successRate)}**` : "") +
                                `\nざんねーん`
                            )
                    ],
                    components: []
                });

                collector.stop();
                return;
            }

            // 🎉 完全制覇
            if (round >= 32) {
                isGameOver = true;
                await btn.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x00ff88)
                            .setTitle("🎉 完全制覇！32ラウンドクリア！")
                            .setDescription(
                                `**全32ラウンド成功！**\n` +
                                `成功確率：**${formatPercent(successRate)}**\n` +
                                `あなたは異常レベルの強運の持ち主です。`
                            )
                    ],
                    components: []
                });

                collector.stop();
                return;
            }

            // 次のラウンド
            round++;
            const nextSuccessRate = (1 / (2 ** (round - 1))) * 100;

            await btn.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setTitle("⭕ ないす！")
                        .setDescription(
                            `**Round ${round} / 32**\n` +
                            `成功確率：**${formatPercent(nextSuccessRate)}**\n\n⏱️ **10秒以内に選択してください**`
                        )
                ],
                components: generateButtons()
            });

            roundTimeout = startRoundTimeout(interaction, round, () => endGameTimeout(interaction, round));
        });

        // タイムアップ時
        function endGameTimeout(interaction, roundNum) {
            isGameOver = true;
            const successRounds = roundNum - 1;
            const successRate = (1 / (2 ** successRounds)) * 100;

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle("⌛ Time Up")
                        .setDescription(
                            `**10秒以内に選択がなかったため中断されました。**\n` +
                            `**${successRounds} ラウンド成功！**` +
                            (successRounds > 0 ? `\nここまでの成功確率：**${formatPercent(successRate)}**` : "")
                        )
                ],
                components: []
            });
            collector.stop();
        }
    }
};

function generateButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("0").setLabel("0").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("1").setLabel("1").setStyle(ButtonStyle.Primary)
        )
    ];
}

function startRoundTimeout(interaction, round, onTimeout) {
    return setTimeout(onTimeout, 10000);
}

function formatPercent(num) {
    if (num >= 0.01) return `${num.toFixed(2)}%`;
    return num.toExponential(2).replace("e-", " × 10^-") + " %";
}
