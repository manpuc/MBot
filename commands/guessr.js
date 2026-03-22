const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const axios = require("axios");

const GMAPS_KEY = process.env.GMAPS_KEY;

const LOCATIONS = [
    { country: "Japan", lat: 35.6895, lng: 139.6917 },
    { country: "USA", lat: 40.7128, lng: -74.0060 },
    { country: "France", lat: 48.8566, lng: 2.3522 },
    { country: "Brazil", lat: -23.5505, lng: -46.6333 },
    { country: "Australia", lat: -33.8688, lng: 151.2093 },
    { country: "UK", lat: 51.5074, lng: -0.1278 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guessr")
        .setDescription("ジオゲッサー風ゲーム！ストリートビュー画像から国を当てよう！"),

    async execute(interaction) {
        await interaction.deferReply();

        const correct = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

        let choices = [correct];
        while (choices.length < 3) {
            const pick = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            if (!choices.includes(pick)) choices.push(pick);
        }
        choices.sort(() => Math.random() - 0.5);

        const heading = Math.floor(Math.random() * 360);
        const svUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${correct.lat},${correct.lng}&fov=90&heading=${heading}&pitch=0&key=${GMAPS_KEY}`;

        // 画像を取得してAttachmentに
        let attachment;
        try {
            const response = await axios.get(svUrl, { responseType: "arraybuffer" });
            attachment = new AttachmentBuilder(Buffer.from(response.data), { name: "streetview.jpg" });
        } catch (err) {
            return interaction.editReply("Street Viewの画像取得に失敗しました。");
        }

        const embed = new EmbedBuilder()
            .setTitle("🌍 どの国でしょう？")
            .setColor("Blue")
            .setFooter({ text: "正しい国を選んでください" })
            .setImage("attachment://streetview.jpg");

        const row = new ActionRowBuilder();
        for (const c of choices) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`guess_${c.country}`)
                    .setLabel(c.country)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        await interaction.editReply({ embeds: [embed], components: [row], files: [attachment] });

        const collector = interaction.channel.createMessageComponentCollector({ time: 15000, max: 1 });

        collector.on("collect", async (btn) => {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: "これはあなたのゲームではありません！", ephemeral: true });
            }
            const userPick = btn.customId.replace("guess_", "");
            const correctAnswer = correct.country;
            const resultText = userPick === correctAnswer ? `🎉 正解！ ${correct.country} でした！` : `❌ 不正解…正解は ${correctAnswer} です`;

            const resultEmbed = new EmbedBuilder()
                .setTitle(resultText)
                .setColor(userPick === correctAnswer ? "Gold" : "Red")
                .setImage("attachment://streetview.jpg");

            await btn.update({ embeds: [resultEmbed], components: [] });
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                await interaction.editReply({
                    content: `時間切れです！正解は ${correct.country} でした`,
                    components: [],
                });
            }
        });
    },
};
